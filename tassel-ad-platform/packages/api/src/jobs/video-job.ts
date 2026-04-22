import { Queue, Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import {
  renderMotionGraphicsVideo,
  inferTemplate,
  buildSubtext,
} from '../services/motion-graphics-renderer.js';

export interface VideoJobData {
  adDraftId: string;
}

export const videoQueue = new Queue<VideoJobData>('video-generation', { connection: redis });

export const videoWorker = new Worker<VideoJobData>(
  'video-generation',
  async (job) => {
    const { adDraftId } = job.data;

    await job.updateProgress(10);
    console.log(`[video] Rendering motion graphic for ad draft ${adDraftId}`);

    // ── Load ad + campaign context ──────────────────────────────────────────
    const ad = await prisma.adDraft.findUniqueOrThrow({
      where: { id: adDraftId },
      include: {
        campaign: {
          select: {
            goal: true,
            referenceImageUrl: true,
            client: { select: { name: true } },
          },
        },
      },
    });

    await job.updateProgress(20);

    const template = inferTemplate(ad.campaign.goal);
    const subtext = buildSubtext(template, ad.campaign.goal);

    // ── Render the motion graphic ───────────────────────────────────────────
    const { videoUrl } = await renderMotionGraphicsVideo({
      adDraftId,
      headline: ad.headline,
      subtext,
      schoolName: ad.campaign.client.name,
      photoUrl: ad.campaign.referenceImageUrl ?? undefined,
      template,
    });

    await job.updateProgress(85);

    // ── Save results ────────────────────────────────────────────────────────
    await prisma.adDraft.update({
      where: { id: adDraftId },
      data: {
        videoUrl,
        videoStatus: 'completed',
        videoJobId: null,
      },
    });

    // Also log as a MediaAsset
    await prisma.mediaAsset.upsert({
      where: {
        // use a find-first pattern since there's no unique constraint on adDraftId+fileType
        id: (
          await prisma.mediaAsset.findFirst({ where: { adDraftId, fileType: 'video' } })
        )?.id ?? 'new',
      },
      create: { adDraftId, fileUrl: videoUrl, fileType: 'video' },
      update: { fileUrl: videoUrl },
    });

    await job.updateProgress(100);
    console.log(`[video] Rendered → ${videoUrl}`);
    return { videoUrl };
  },
  {
    connection: redis,
    limiter: { max: 3, duration: 1000 },
  },
);

videoWorker.on('completed', (job, result) => {
  console.log(`[video] Job ${job.id} complete — ${result.videoUrl}`);
});

videoWorker.on('failed', async (job, err) => {
  console.error(`[video] Job ${job?.id} failed:`, err.message);
  if (job?.data.adDraftId) {
    await prisma.adDraft
      .update({
        where: { id: job.data.adDraftId },
        data: { videoStatus: 'failed', videoError: err.message },
      })
      .catch(() => {});
  }
});
