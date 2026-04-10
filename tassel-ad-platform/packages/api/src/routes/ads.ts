import { Router } from 'express';
import type { ApiResponse } from '@tassel/types';

export const adsRouter = Router();

// PUT /api/ads/:id — Edit ad draft
adsRouter.put('/:id', async (_req, res, next) => {
  try {
    // TODO: implement via ad-service
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/media — Upload media
adsRouter.post('/:id/media', async (_req, res, next) => {
  try {
    // TODO: multer middleware + S3 upload
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/approve — Approve ad
adsRouter.post('/:id/approve', async (_req, res, next) => {
  try {
    // TODO: update status to 'approved' via ad-service
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/reject — Reject ad with reason
adsRouter.post('/:id/reject', async (_req, res, next) => {
  try {
    // TODO: update status to 'rejected' via ad-service
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/publish — Publish approved ad to Meta
adsRouter.post('/:id/publish', async (_req, res, next) => {
  try {
    // TODO: enqueue publish job via BullMQ
    res.json({ success: true, data: { jobId: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/ads/:id/publish-status — Check Meta review status
adsRouter.get('/:id/publish-status', async (_req, res, next) => {
  try {
    // TODO: poll Meta API for review status
    res.json({ success: true, data: { status: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
