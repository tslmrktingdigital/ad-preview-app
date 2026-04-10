import { Router } from 'express';
import type { ApiResponse } from '@tassel/types';

export const clientsRouter = Router();

// POST /api/clients — Create new client
clientsRouter.post('/', async (_req, res, next) => {
  try {
    // TODO: implement via client-service
    res.status(201).json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients — List all clients
clientsRouter.get('/', async (_req, res, next) => {
  try {
    // TODO: implement via client-service
    res.json({ success: true, data: [] } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/scan — Trigger website scan
clientsRouter.post('/:id/scan', async (_req, res, next) => {
  try {
    // TODO: enqueue scan job via BullMQ
    res.json({ success: true, data: { jobId: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id/profile — Get school profile
clientsRouter.get('/:id/profile', async (_req, res, next) => {
  try {
    // TODO: implement via client-service
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// PUT /api/clients/:id/profile — Edit school profile
clientsRouter.put('/:id/profile', async (_req, res, next) => {
  try {
    // TODO: implement via client-service
    res.json({ success: true, data: null } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/clients/:id/connect-meta — Initiate Meta OAuth flow
clientsRouter.post('/:id/connect-meta', async (_req, res, next) => {
  try {
    // TODO: build Meta OAuth redirect URL
    res.json({ success: true, data: { authUrl: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});
