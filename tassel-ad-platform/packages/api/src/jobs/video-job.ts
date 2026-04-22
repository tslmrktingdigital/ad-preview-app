import { Queue, Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { startVideoGeneration, getVideoGenerationStatus } from '../services/video-service.js';

export interface VideoJobData {
  adDraftId: string;
}

export const videoQueue = new Queue<VideoJobData>('video-generation', { connection: redis });

const POLL_INTERVAL_MS = 6_000;  // poll every 6 seconds
const MAX_POLLS = 100;           // give up after ~10 minutes

export const videoWorker = new Worker<VideoJobData>(
  'video-generation',
  async (job) => {
    const { adDraftId } = job.data;

    await job.updateProgress(5);
    console.log(`[video] Starting generation for ad draft ${adDraftId}`);

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

    // ── Start Luma AI generation ────────────────────────────────────────────
    const { generationId } = await startVideoGeneration({
      imageBrief: ad.imageBrief,
      headline: ad.headline,
      schoolName: ad.campaign.client.name,
      campaignGoal: ad.campaign.goal,
      referenceImageUrl: ad.campaign.referenceImageUrl ?? undefined,
    });

    console.log(`[video] Luma generation started: ${generationId}`);

    // Mark as generating
    await prisma.adDraft.update({
      where: { id: adDraftId },
      data: { videoJobId: generationId, videoStatus: 'generating' },
    });

    await job.updateProgress(15);

    // ── Poll until complete ─────────────────────────────────────────────────
    for (let i = 0; i < MAX_POLLS; i++) {
      await sleep(POLL_INTERVAL_MS);

      const status = await getVideoGenerationStatus(generationId);
      const progressPct = Math.min(15 + Math.round((i / MAX_POLLS) * 80), 95);
      await job.updateProgress(progressPct);

      console.log(`[video] Poll ${i + 1}/${MAX_POLLS} — state: ${status.state}`);

      if (status.state === 'completed' && status.videoUrl) {
        // Save video URL to ad draft
        await prisma.adDraft.update({
          where: { id: adDraftId },
          data: {
            videoUrl: status.videoUrl,
            videoStatus: 'completed',
          },
        });

        // Also create a MediaAsset record
        await prisma.mediaAsset.create({
          data: {
            adDraftId,
            fileUrl: status.videoUrl,
            fileType: 'video',
          },
        });

        await job.updateProgress(100);
        console.log(`[video] Completed — ${status.videoUrl}`);
        return { videoUrl: status.videoUrl };
      }

      if (status.state === 'failed') {
        throw new Error(status.errorMessage ?? 'Luma AI generation failed');
      }

      // 'queued' | 'dreaming' — keep polling
    }

    throw new Error('Video generation timed out after 10 minutes');
  },
  {
    connection: redis,
    limiter: { max: 3, duration: 1000 }, // max 3 concurrent video jobs
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

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
