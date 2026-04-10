import { Queue, Worker } from 'bullmq';

const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };

export const publishQueue = new Queue('meta-publish', { connection });

export const publishWorker = new Worker(
  'meta-publish',
  async (job) => {
    const { adDraftId } = job.data as { adDraftId: string };
    console.log(`Publishing ad draft ${adDraftId} to Meta`);
    // TODO: load ad draft + client meta credentials
    // TODO: call MetaClient to create campaign -> adset -> ad
    // TODO: write to publishing_log table
  },
  {
    connection,
    limiter: { max: 5, duration: 1000 }, // Meta API rate limit safety
  }
);

publishWorker.on('completed', (job) => {
  console.log(`Publish job ${job.id} completed`);
});

publishWorker.on('failed', (job, err) => {
  console.error(`Publish job ${job?.id} failed:`, err);
});
