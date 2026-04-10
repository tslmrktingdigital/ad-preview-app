import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../lib/validate.js';
import { createClient, listClients, getClientById, updateSchoolProfile } from '../services/client-service.js';
import { scanQueue } from '../jobs/scan-job.js';
import type { ApiResponse } from '@tassel/types';

export const clientsRouter = Router();

// ── Schemas ──────────────────────────────────────────────────────────────────

const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  websiteUrl: z.string().url('Must be a valid URL'),
});

const updateProfileSchema = z.object({
  profileData: z.record(z.unknown()),
});

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/clients
clientsRouter.post('/', validate(createClientSchema), async (req, res, next) => {
  try {
    const client = await createClient(req.body);
    res.status(201).json({ success: true, data: client } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients
clientsRouter.get('/', async (_req, res, next) => {
  try {
    const clients = await listClients();
    res.json({ success: true, data: clients } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id
clientsRouter.get('/:id', async (req, res, next) => {
  try {
    const client = await getClientById(req.params.id);
    res.json({ success: true, data: client } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/scan — Enqueue website scan job
clientsRouter.post('/:id/scan', async (req, res, next) => {
  try {
    const client = await getClientById(req.params.id);
    const job = await scanQueue.add(
      'scan',
      { clientId: client.id, url: client.websiteUrl },
      { attempts: 2, backoff: { type: 'exponential', delay: 5000 } }
    );
    res.json({ success: true, data: { jobId: job.id } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/scan-status — Poll scan job progress
clientsRouter.get('/:id/scan-status', async (req, res, next) => {
  try {
    const waiting = await scanQueue.getJobs(['active', 'waiting', 'completed', 'failed']);
    const job = waiting
      .filter((j) => j.data.clientId === req.params.id)
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))[0];

    if (!job) {
      res.json({ success: true, data: { status: 'not_started' } } satisfies ApiResponse);
      return;
    }

    const state = await job.getState();
    const progress = job.progress;
    res.json({
      success: true,
      data: { jobId: job.id, status: state, progress, result: job.returnvalue },
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/profile
clientsRouter.get('/:id/profile', async (req, res, next) => {
  try {
    const client = await getClientById(req.params.id);
    res.json({ success: true, data: (client as any).schoolProfile ?? null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// PUT /api/clients/:id/profile — Manual edit of extracted profile data
clientsRouter.put('/:id/profile', validate(updateProfileSchema), async (req, res, next) => {
  try {
    const profile = await updateSchoolProfile(req.params.id, req.body.profileData as any);
    res.json({ success: true, data: profile } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/connect-meta — Initiate Meta OAuth (stub)
clientsRouter.post('/:id/connect-meta', async (req, res, next) => {
  try {
    const { META_APP_ID, FRONTEND_URL } = process.env;
    if (!META_APP_ID) {
      res.status(503).json({ success: false, error: 'META_APP_ID not configured' } satisfies ApiResponse);
      return;
    }
    const redirectUri = encodeURIComponent(`${FRONTEND_URL}/api/auth/meta/callback`);
    const state = encodeURIComponent(req.params.id);
    const authUrl =
      `https://www.facebook.com/v20.0/dialog/oauth` +
      `?client_id=${META_APP_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&scope=ads_management,ads_read,pages_show_list,business_management`;
    res.json({ success: true, data: { authUrl } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
