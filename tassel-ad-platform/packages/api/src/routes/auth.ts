import { Router } from 'express';
import type { ApiResponse } from '@tassel/types';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (_req, res, next) => {
  try {
    // TODO: validate credentials + issue JWT
    res.json({ success: true, data: { token: null } } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/meta/callback — Meta OAuth callback
authRouter.get('/meta/callback', async (_req, res, next) => {
  try {
    // TODO: exchange code for access token, store encrypted
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});
