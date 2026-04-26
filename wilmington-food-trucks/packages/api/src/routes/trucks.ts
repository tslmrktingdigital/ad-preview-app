import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse, FoodTruckWithSchedule } from '@wft/shared';

export const trucksRouter = Router();

// GET /api/trucks — list all active trucks with today's location
trucksRouter.get('/', async (_req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const trucks = await prisma.foodTruck.findMany({
      where: { isActive: true },
      include: {
        schedule: {
          where: { date: { gte: today, lt: tomorrow } },
          orderBy: { startTime: 'asc' },
        },
        posts: {
          orderBy: { scrapedAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { name: 'asc' },
    });

    const response: ApiResponse<typeof trucks> = { success: true, data: trucks };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// GET /api/trucks/:slug — single truck with upcoming week schedule + recent posts
trucksRouter.get('/:slug', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const truck = await prisma.foodTruck.findUnique({
      where: { slug: req.params.slug },
      include: {
        schedule: {
          where: { date: { gte: today, lte: nextWeek } },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
        posts: {
          orderBy: { scrapedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!truck) {
      res.status(404).json({ success: false, error: 'Truck not found' });
      return;
    }

    const response: ApiResponse<typeof truck> = { success: true, data: truck };
    res.json(response);
  } catch (err) {
    next(err);
  }
});
