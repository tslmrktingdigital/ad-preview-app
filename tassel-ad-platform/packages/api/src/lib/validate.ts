import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import type { ApiResponse } from '@tassel/types';

/**
 * Returns an Express middleware that validates req.body against the given Zod schema.
 * On failure it responds 400 with a structured error; on success it calls next().
 */
export function validate<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = formatZodError(result.error);
      res.status(400).json({ success: false, error: message } satisfies ApiResponse);
      return;
    }
    req.body = result.data;
    next();
  };
}

function formatZodError(err: ZodError): string {
  return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
}
