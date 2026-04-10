import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import type { ApiResponse } from '@tassel/types';

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized' } satisfies ApiResponse);
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? '');
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' } satisfies ApiResponse);
  }
};
