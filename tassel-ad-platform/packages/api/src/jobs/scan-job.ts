import { Queue, Worker } from 'bullmq';

const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };

export const scanQueue = new Queue('website-scan', { connection });

export const scanWorker = new Worker(
  'website-scan',
  async (job) => {
    const { clientId, url } = job.data as { clientId: string; url: string };
    console.log(`Starting scan for client ${clientId}: ${url}`);
    // TODO: call scanner package crawler
    // TODO: update school_profiles table with result
  },
  { connection }
);

scanWorker.on('completed', (job) => {
  console.log(`Scan job ${job.id} completed`);
});

scanWorker.on('failed', (job, err) => {
  console.error(`Scan job ${job?.id} failed:`, err);
});
