import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse } from '@wft/shared';

export const scheduleRouter = Router();

// GET /api/schedule?date=2025-04-25 — all trucks operating on a given date
scheduleRouter.get('/', async (req, res, next) => {
  try {
    const dateParam = req.query.date as string | undefined;
    const target = dateParam ? new Date(dateParam) : new Date();
    target.setHours(0, 0, 0, 0);
    const dayAfter = new Date(target);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const entries = await prisma.scheduleEntry.findMany({
      where: { date: { gte: target, lt: dayAfter } },
      include: { truck: true },
      orderBy: [{ startTime: 'asc' }, { locationName: 'asc' }],
    });

    const response: ApiResponse<typeof entries> = { success: true, data: entries };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// GET /api/schedule/week — next 7 days grouped by date
scheduleRouter.get('/week', async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const entries = await prisma.scheduleEntry.findMany({
      where: { date: { gte: today, lte: nextWeek } },
      include: { truck: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    // Group by date string
    const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
      const key = entry.date.toISOString().split('T')[0]!;
      (acc[key] ??= []).push(entry);
      return acc;
    }, {});

    const response: ApiResponse<typeof grouped> = { success: true, data: grouped };
    res.json(response);
  } catch (err) {
    next(err);
  }
});
