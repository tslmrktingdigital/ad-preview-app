import { prisma } from '../lib/prisma.js';
import type { CampaignGoal, CampaignSeason, AdVariation } from '@tassel/types';

export interface CreateCampaignInput {
  clientId: string;
  name: string;
  goal: CampaignGoal;
  season: CampaignSeason;
  targetDemographic?: string;
  messagingEmphasis?: string;
  toneOverrides?: string;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
}

export async function createCampaign(data: CreateCampaignInput) {
  return prisma.campaign.create({
    data: {
      clientId: data.clientId,
      name: data.name,
      goal: data.goal,
      season: data.season,
      targetDemographic: data.targetDemographic,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
    },
    include: { client: { select: { name: true } } },
  });
}

export async function getCampaignById(id: string) {
  return prisma.campaign.findUniqueOrThrow({
    where: { id },
    include: {
      client: true,
      adDrafts: {
        orderBy: { createdAt: 'asc' },
        include: { mediaAssets: true },
      },
    },
  });
}

export async function listCampaigns(clientId?: string) {
  return prisma.campaign.findMany({
    where: clientId ? { clientId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { adDrafts: true } },
    },
  });
}

export async function saveAdDrafts(
  campaignId: string,
  variations: AdVariation[],
  promptVersion: string
) {
  // Create all drafts in a single transaction
  return prisma.$transaction(
    variations.map((v) =>
      prisma.adDraft.create({
        data: {
          campaignId,
          primaryText: v.primaryText,
          headline: v.headline,
          description: v.description,
          cta: v.cta,
          imageBrief: v.imageBrief,
          hashtags: v.hashtags,
          targetingParams: v.targetingParams as any,
          promptVersion,
          status: 'draft',
        },
      })
    )
  );
}

export async function listAdDrafts(campaignId: string) {
  return prisma.adDraft.findMany({
    where: { campaignId },
    orderBy: { createdAt: 'asc' },
    include: { mediaAssets: true },
  });
}
