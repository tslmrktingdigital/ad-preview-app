import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { getAdById, updateAdStatus, updateAdCopy } from '../services/ad-service.js';
import { publishQueue } from '../jobs/publish-job.js';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse } from '@tassel/types';

export const adsRouter = Router();

// ── Schemas ──────────────────────────────────────────────────────────────────

const updateAdSchema = z.object({
  primaryText: z.string().min(1).optional(),
  headline: z.string().min(1).optional(),
  description: z.string().optional(),
  cta: z.enum(['LEARN_MORE', 'APPLY_NOW', 'SIGN_UP', 'CONTACT_US', 'GET_DIRECTIONS']).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' });

const rejectSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/ads — list all ads (optionally ?status=draft|approved|etc.)
adsRouter.get('/', async (req, res, next) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const ads = await prisma.adDraft.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        mediaAssets: true,
        campaign: { select: { id: true, name: true, client: { select: { id: true, name: true } } } },
      },
    });
    res.json({ success: true, data: ads } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/ads/:id
adsRouter.get('/:id', async (req, res, next) => {
  try {
    const ad = await prisma.adDraft.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        mediaAssets: true,
        campaign: { include: { client: true } },
        publishingLog: { orderBy: { publishedAt: 'desc' }, take: 5 },
      },
    });
    res.json({ success: true, data: ad } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// PUT /api/ads/:id — Edit ad copy
adsRouter.put('/:id', validate(updateAdSchema), async (req, res, next) => {
  try {
    const ad = await updateAdCopy(req.params.id, req.body);
    res.json({ success: true, data: ad } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/approve
adsRouter.post('/:id/approve', async (req, res, next) => {
  try {
    const ad = await getAdById(req.params.id);
    if (ad.status === 'published') {
      res.status(409).json({ success: false, error: 'Ad is already published' } satisfies ApiResponse);
      return;
    }
    const updated = await updateAdStatus(req.params.id, 'approved');
    res.json({ success: true, data: updated } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/reject
adsRouter.post('/:id/reject', validate(rejectSchema), async (req, res, next) => {
  try {
    const updated = await prisma.adDraft.update({
      where: { id: req.params.id },
      data: { status: 'rejected', rejectionReason: req.body.reason },
    });
    res.json({ success: true, data: updated } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/ads/:id/publish — Enqueue Meta publishing job
adsRouter.post('/:id/publish', async (req, res, next) => {
  try {
    const ad = await getAdById(req.params.id);
    if (ad.status !== 'approved') {
      res.status(409).json({
        success: false,
        error: `Ad must be approved before publishing (current status: ${ad.status})`,
      } satisfies ApiResponse);
      return;
    }
    const job = await publishQueue.add(
      'publish',
      { adDraftId: ad.id },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
    );
    res.json({ success: true, data: { jobId: job.id } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/ads/:id/publish-status
adsRouter.get('/:id/publish-status', async (req, res, next) => {
  try {
    const log = await prisma.publishingLog.findFirst({
      where: { adDraftId: req.params.id },
      orderBy: { publishedAt: 'desc' },
    });
    res.json({ success: true, data: log } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
