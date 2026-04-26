import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { prisma } from '../lib/prisma.js';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const crawlQueue = new Queue('crawl', { connection });

export async function enqueueCrawl(truckId: string): Promise<void> {
  await crawlQueue.add('crawl-truck', { truckId }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  });
}

// Scheduled crawl: enqueue all active trucks every 4 hours
export async function enqueueAllTrucks(): Promise<void> {
  const trucks = await prisma.foodTruck.findMany({ where: { isActive: true } });
  for (const truck of trucks) {
    await enqueueCrawl(truck.id);
  }
  console.log(`Enqueued crawl for ${trucks.length} trucks`);
}

// Worker — runs in its own process (see packages/api/src/worker.ts)
export function startCrawlWorker(): void {
  new Worker(
    'crawl',
    async (job) => {
      const { truckId } = job.data as { truckId: string };
      const { runCrawlForTruck } = await import('../services/crawl-service.js');
      await runCrawlForTruck(truckId);
    },
    { connection, concurrency: 3 }
  );
  console.log('Crawl worker started');
}
