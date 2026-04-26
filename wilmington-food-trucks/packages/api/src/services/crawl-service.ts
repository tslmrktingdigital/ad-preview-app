import { prisma } from '../lib/prisma.js';
import type { CrawlResult } from '@wft/shared';

// Dynamically import crawler package so API can start without it in tests
async function getCrawler() {
  const { crawlTruck } = await import('@wft/crawler');
  return crawlTruck;
}

export async function runCrawlForTruck(truckId: string): Promise<void> {
  const truck = await prisma.foodTruck.findUnique({ where: { id: truckId } });
  if (!truck) throw new Error(`Truck ${truckId} not found`);

  const sources: Array<{ platform: string; url: string }> = [
    truck.facebookUrl ? { platform: 'facebook', url: truck.facebookUrl } : null,
    truck.instagramUrl ? { platform: 'instagram', url: truck.instagramUrl } : null,
    truck.twitterUrl ? { platform: 'twitter', url: truck.twitterUrl } : null,
    truck.websiteUrl ? { platform: 'website', url: truck.websiteUrl } : null,
  ].filter(Boolean) as Array<{ platform: string; url: string }>;

  const crawlTruck = await getCrawler();

  for (const source of sources) {
    let result: CrawlResult;
    try {
      result = await crawlTruck(truckId, source.platform as CrawlResult['source'], source.url);
    } catch (err) {
      await prisma.crawlLog.create({
        data: {
          truckId,
          source: source.platform,
          sourceUrl: source.url,
          status: 'failed',
          errors: [(err as Error).message],
        },
      });
      continue;
    }

    // Upsert schedule entries (dedup by truck + date + locationName)
    for (const entry of result.scheduleEntries) {
      await prisma.scheduleEntry.upsert({
        where: {
          // composite unique not defined in schema — use findFirst + create pattern
          id: `${truckId}-${entry.date}-${entry.locationName}`.replace(/\s+/g, '-'),
        },
        update: { ...entry, date: new Date(entry.date), scrapedAt: new Date() },
        create: {
          ...entry,
          id: `${truckId}-${entry.date}-${entry.locationName}`.replace(/\s+/g, '-'),
          truckId,
          date: new Date(entry.date),
          scrapedAt: new Date(),
        },
      });
    }

    // Upsert posts (dedup by postUrl)
    for (const post of result.posts) {
      await prisma.socialPost.upsert({
        where: { postUrl: post.postUrl },
        update: { text: post.text, imageUrl: post.imageUrl, scrapedAt: new Date() },
        create: { ...post, truckId, scrapedAt: new Date(), postedAt: post.postedAt ? new Date(post.postedAt) : undefined },
      });
    }

    await prisma.crawlLog.create({
      data: {
        truckId,
        source: source.platform,
        sourceUrl: source.url,
        status: result.errors.length === 0 ? 'success' : 'partial',
        errors: result.errors,
      },
    });
  }
}
