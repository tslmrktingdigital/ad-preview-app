import { Router } from 'express';
import type { ApiResponse } from '@tassel/types';

export const campaignsRouter = Router();

// POST /api/campaigns — Create campaign brief
campaignsRouter.post('/', async (_req, res, next) => {
  try {
    // TODO: implement via campaign-service
    res.status(201).json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/campaigns/:id/generate — Trigger AI content generation
campaignsRouter.post('/:id/generate', async (_req, res, next) => {
  try {
    // TODO: enqueue content generation job
    res.json({ success: true, data: { jobId: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/campaigns/:id/ads — List ad drafts for campaign
campaignsRouter.get('/:id/ads', async (_req, res, next) => {
  try {
    // TODO: implement via campaign-service
    res.json({ success: true, data: [] } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
