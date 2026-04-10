import { Queue, Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { generateAdVariations } from '@tassel/content-engine/generator';
import { saveAdDrafts } from '../services/campaign-service.js';
import type { SchoolProfile, CampaignBrief, CampaignGoal, CampaignSeason } from '@tassel/types';

export interface GenerateJobData {
  campaignId: string;
}

export const generateQueue = new Queue<GenerateJobData>('ad-generation', { connection: redis });

export const generateWorker = new Worker<GenerateJobData>(
  'ad-generation',
  async (job) => {
    const { campaignId } = job.data;

    await job.updateProgress(5);
    console.log(`[generate] Starting generation for campaign ${campaignId}`);

    // Load campaign with client profile
    const campaign = await prisma.campaign.findUniqueOrThrow({
      where: { id: campaignId },
      include: {
        client: { include: { schoolProfile: true } },
      },
    });

    if (!campaign.client.schoolProfile) {
      throw new Error(
        `Client "${campaign.client.name}" has no school profile yet. Run a website scan first.`
      );
    }

    const schoolProfile = campaign.client.schoolProfile.profileData as unknown as SchoolProfile;

    const brief: CampaignBrief = {
      clientId: campaign.clientId,
      name: campaign.name,
      goal: campaign.goal as CampaignGoal,
      season: (campaign.season ?? 'general') as CampaignSeason,
      targetDemographic: campaign.targetDemographic ?? undefined,
    };

    await job.updateProgress(20);
    console.log(`[generate] Calling Claude API for campaign "${campaign.name}"`);

    const result = await generateAdVariations(schoolProfile, brief);

    await job.updateProgress(80);
    console.log(`[generate] Got ${result.variations.length} variations, saving to DB`);

    const drafts = await saveAdDrafts(campaignId, result.variations, result.promptVersion);

    await job.updateProgress(100);
    console.log(`[generate] Saved ${drafts.length} ad drafts for campaign ${campaignId}`);

    return {
      draftsCreated: drafts.length,
      promptVersion: result.promptVersion,
      model: result.model,
      usage: result.usage,
    };
  },
  { connection: redis }
);

generateWorker.on('completed', (job, result) => {
  console.log(
    `[generate] Job ${job.id} complete — ${result.draftsCreated} drafts` +
    ` (${result.usage.inputTokens} in / ${result.usage.outputTokens} out tokens)`
  );
});

generateWorker.on('failed', (job, err) => {
  console.error(`[generate] Job ${job?.id} failed:`, err.message);
});
