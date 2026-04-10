import type { ErrorRequestHandler } from 'express';
import type { ApiResponse } from '@tassel/types';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(err.status ?? 500).json({
    success: false,
    error: message,
  } satisfies ApiResponse);
};
