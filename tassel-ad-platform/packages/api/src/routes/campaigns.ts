import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import {
  createCampaign,
  getCampaignById,
  listCampaigns,
  listAdDrafts,
} from '../services/campaign-service.js';
import { generateQueue } from '../jobs/generate-job.js';
import { buildPreviewLink } from '../services/preview-service.js';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse } from '@tassel/types';

export const campaignsRouter = Router();

// ── Schemas ──────────────────────────────────────────────────────────────────

const createCampaignSchema = z.object({
  clientId: z.string().cuid('Invalid client ID'),
  name: z.string().min(1, 'Campaign name is required'),
  goal: z.enum(['enrollment', 'open_house', 'brand_awareness', 'tour_booking', 'engagement']),
  season: z.enum(['back_to_school', 'open_house', 'enrollment_deadline', 'graduation', 'general']),
  targetDemographic: z.string().optional(),
  messagingEmphasis: z.string().optional(),
  toneOverrides: z.string().optional(),
  budget: z.number().positive().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/campaigns
campaignsRouter.post('/', validate(createCampaignSchema), async (req, res, next) => {
  try {
    const campaign = await createCampaign(req.body);
    res.status(201).json({ success: true, data: campaign } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/campaigns — optionally filter by ?clientId=
campaignsRouter.get('/', async (req, res, next) => {
  try {
    const clientId = typeof req.query.clientId === 'string' ? req.query.clientId : undefined;
    const campaigns = await listCampaigns(clientId);
    res.json({ success: true, data: campaigns } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/campaigns/:id
campaignsRouter.get('/:id', async (req, res, next) => {
  try {
    const campaign = await getCampaignById(req.params.id);
    res.json({ success: true, data: campaign } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/campaigns/:id/generate — Enqueue AI content generation
campaignsRouter.post('/:id/generate', async (req, res, next) => {
  try {
    // Verify campaign exists before enqueuing
    await getCampaignById(req.params.id);

    const job = await generateQueue.add(
      'generate',
      { campaignId: req.params.id },
      { attempts: 2, backoff: { type: 'exponential', delay: 3000 } }
    );
    res.json({ success: true, data: { jobId: job.id } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/campaigns/:id/generate-status — Poll generation job progress
campaignsRouter.get('/:id/generate-status', async (req, res, next) => {
  try {
    const jobs = await generateQueue.getJobs(['active', 'waiting', 'completed', 'failed']);
    const job = jobs
      .filter((j) => j.data.campaignId === req.params.id)
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))[0];

    if (!job) {
      res.json({ success: true, data: { status: 'not_started' } } satisfies ApiResponse);
      return;
    }

    const state = await job.getState();
    res.json({
      success: true,
      data: { jobId: job.id, status: state, progress: job.progress, result: job.returnvalue },
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/campaigns/:id/preview-link — Share all non-rejected ads as multi-variant preview
campaignsRouter.post('/:id/preview-link', async (req, res, next) => {
  try {
    const campaign = await prisma.campaign.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        client: true,
        adDrafts: {
          where: { status: { not: 'rejected' } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (campaign.adDrafts.length === 0) {
      res.status(400).json({ success: false, error: 'No ads to preview yet' } satisfies ApiResponse);
      return;
    }
    const url = await buildPreviewLink(campaign.client, campaign.adDrafts);
    res.json({ success: true, data: { url } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/campaigns/:id/ads
campaignsRouter.get('/:id/ads', async (req, res, next) => {
  try {
    const ads = await listAdDrafts(req.params.id);
    res.json({ success: true, data: ads } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
