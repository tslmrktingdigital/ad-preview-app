import { Queue, Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { MetaClient } from '../lib/meta-client.js';
import { updateAdStatus } from '../services/ad-service.js';

export interface PublishJobData {
  adDraftId: string;
}

export const publishQueue = new Queue<PublishJobData>('meta-publish', { connection: redis });

export const publishWorker = new Worker<PublishJobData>(
  'meta-publish',
  async (job) => {
    const { adDraftId } = job.data;

    await job.updateProgress(5);
    console.log(`[publish] Starting publish for ad draft ${adDraftId}`);

    const ad = await prisma.adDraft.findUniqueOrThrow({
      where: { id: adDraftId },
      include: {
        mediaAssets: true,
        campaign: { include: { client: true } },
      },
    });

    const { client } = ad.campaign;

    if (!client.metaAccessToken || !client.metaAccountId) {
      throw new Error(
        `Client "${client.name}" has no Meta account connected. Use /api/clients/:id/connect-meta first.`
      );
    }

    const meta = new MetaClient(client.metaAccessToken);

    await job.updateProgress(20);

    // 1. Create Campaign
    const campaign = await meta.createCampaign(client.metaAccountId, {
      name: `[Tassel] ${ad.campaign.name}`,
      objective: 'OUTCOME_LEADS',
      status: 'PAUSED', // Always start paused; team activates manually
    }) as any;

    await job.updateProgress(40);

    // 2. Create Ad Set
    const adSet = await meta.createAdSet(client.metaAccountId, {
      name: `[Tassel] ${ad.headline}`,
      campaign_id: campaign.id,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      daily_budget: ad.campaign.budget ? Number(ad.campaign.budget) * 100 : 1000, // in cents
      targeting: ad.targetingParams ?? {},
      status: 'PAUSED',
    }) as any;

    await job.updateProgress(60);

    // 3. Upload image (if available)
    let imageHash: string | undefined;
    const imageAsset = ad.mediaAssets.find((m) => m.fileType === 'image');
    if (imageAsset) {
      const uploaded = await meta.uploadAdImage(client.metaAccountId, imageAsset.fileUrl) as any;
      imageHash = Object.values(uploaded.images as Record<string, { hash: string }>)[0]?.hash;
    }

    // 4. Create Creative
    const creative = await meta.createAdCreative(client.metaAccountId, {
      name: `[Tassel] ${ad.headline}`,
      object_story_spec: {
        page_id: client.metaPageId ?? undefined,
        link_data: {
          message: ad.primaryText,
          link: client.websiteUrl ?? 'https://example.com',
          name: ad.headline,
          description: ad.description ?? '',
          call_to_action: { type: ad.cta },
          ...(imageHash ? { image_hash: imageHash } : {}),
        },
      },
    }) as any;

    await job.updateProgress(80);

    // 5. Create Ad
    const metaAd = await meta.createAd(client.metaAccountId, {
      name: `[Tassel] ${ad.headline}`,
      adset_id: adSet.id,
      creative: { creative_id: creative.id },
      status: 'PAUSED',
    }) as any;

    // 6. Log + update status
    await prisma.publishingLog.create({
      data: {
        adDraftId,
        metaCampaignId: campaign.id,
        metaAdsetId: adSet.id,
        metaAdId: metaAd.id,
        status: 'published',
        apiResponse: { campaign, adSet, creative, ad: metaAd },
      },
    });

    await updateAdStatus(adDraftId, 'published');

    await job.updateProgress(100);
    return { metaCampaignId: campaign.id, metaAdId: metaAd.id };
  },
  {
    connection: redis,
    limiter: { max: 5, duration: 1000 }, // Respect Meta API rate limits
  }
);

publishWorker.on('completed', (job, result) => {
  console.log(`[publish] Job ${job.id} complete — Meta ad ${result.metaAdId}`);
});

publishWorker.on('failed', async (job, err) => {
  console.error(`[publish] Job ${job?.id} failed:`, err.message);
  if (job?.data.adDraftId) {
    await prisma.publishingLog.create({
      data: {
        adDraftId: job.data.adDraftId,
        status: 'failed',
        errorMessage: err.message,
      },
    }).catch(() => {});
  }
});
