import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { enqueueCrawl } from '../jobs/crawl-queue.js';
import type { ApiResponse } from '@wft/shared';

export const adminRouter = Router();

const TruckSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  cuisineTypes: z.array(z.string()).default([]),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  facebookUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
});

// POST /api/admin/trucks — create a new truck entry
adminRouter.post('/trucks', async (req, res, next) => {
  try {
    const data = TruckSchema.parse(req.body);
    const truck = await prisma.foodTruck.create({ data });
    const response: ApiResponse<typeof truck> = { success: true, data: truck };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/trucks/:id — update truck info
adminRouter.patch('/trucks/:id', async (req, res, next) => {
  try {
    const data = TruckSchema.partial().parse(req.body);
    const truck = await prisma.foodTruck.update({
      where: { id: req.params.id },
      data,
    });
    const response: ApiResponse<typeof truck> = { success: true, data: truck };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/trucks/:id/crawl — trigger an immediate crawl for a truck
adminRouter.post('/trucks/:id/crawl', async (req, res, next) => {
  try {
    const truck = await prisma.foodTruck.findUnique({ where: { id: req.params.id } });
    if (!truck) {
      res.status(404).json({ success: false, error: 'Truck not found' });
      return;
    }
    await enqueueCrawl(truck.id);
    res.json({ success: true, data: { message: 'Crawl job enqueued' } });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/schedule — manually add a schedule entry
const ScheduleSchema = z.object({
  truckId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  locationName: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().optional(),
});

adminRouter.post('/schedule', async (req, res, next) => {
  try {
    const data = ScheduleSchema.parse(req.body);
    const entry = await prisma.scheduleEntry.create({
      data: { ...data, date: new Date(data.date) },
    });
    const response: ApiResponse<typeof entry> = { success: true, data: entry };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});
