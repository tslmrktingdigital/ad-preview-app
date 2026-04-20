import { Queue, Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { crawlWebsite } from '@tassel/scanner/crawler';
import { parseSchoolProfile } from '@tassel/scanner/parser';

export interface ScanJobData {
  clientId: string;
  url: string;
}

export const scanQueue = new Queue<ScanJobData>('website-scan', { connection: redis });

export const scanWorker = new Worker<ScanJobData>(
  'website-scan',
  async (job) => {
    const { clientId, url } = job.data;

    await job.updateProgress(5);
    console.log(`[scan] Starting crawl for client ${clientId}: ${url}`);

    // Mark profile as scanning
    await prisma.schoolProfile.upsert({
      where: { clientId },
      update: { scanStatus: 'scanning', scanDate: new Date() },
      create: { clientId, profileData: {}, scanStatus: 'scanning' },
    });

    await job.updateProgress(10);
    const crawlResults = await crawlWebsite(url);
    console.log(`[scan] Crawled ${crawlResults.length} pages for client ${clientId}`);

    await job.updateProgress(80);

    // Extract school name from the client record for the parser
    const client = await prisma.client.findUniqueOrThrow({ where: { id: clientId } });
    const profile = parseSchoolProfile(crawlResults, client.name);

    await prisma.schoolProfile.upsert({
      where: { clientId },
      update: {
        profileData: profile as any,
        scanStatus: 'complete',
        scanDate: new Date(),
      },
      create: {
        clientId,
        profileData: profile as any,
        scanStatus: 'complete',
      },
    });

    await job.updateProgress(100);
    console.log(`[scan] Profile saved for client ${clientId}`);

    return { pagesScanned: crawlResults.length, profileName: profile.name };
  },
  { connection: redis }
);

scanWorker.on('completed', (job, result) => {
  console.log(`[scan] Job ${job.id} complete — ${result.pagesScanned} pages, "${result.profileName}"`);
});

scanWorker.on('failed', async (job, err) => {
  console.error(`[scan] Job ${job?.id} failed:`, err.message);
  if (job?.data.clientId) {
    await prisma.schoolProfile.upsert({
      where: { clientId: job.data.clientId },
      update: { scanStatus: 'failed' },
      create: { clientId: job.data.clientId, profileData: {}, scanStatus: 'failed' },
    }).catch(() => {});
  }
});
