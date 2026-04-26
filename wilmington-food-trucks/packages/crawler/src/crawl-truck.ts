import type { CrawlResult } from '@wft/shared';
import { scrapeWebsite } from './scrapers/website-scraper.js';
import { scrapeFacebook } from './scrapers/facebook-scraper.js';
import { scrapeInstagram } from './scrapers/instagram-scraper.js';
import { scrapeTwitter } from './scrapers/twitter-scraper.js';

type Platform = CrawlResult['source'];

const scrapers: Record<Platform, (url: string) => Promise<Omit<CrawlResult, 'truckId' | 'source' | 'sourceUrl' | 'crawledAt'>>> = {
  website: scrapeWebsite,
  facebook: scrapeFacebook,
  instagram: scrapeInstagram,
  twitter: scrapeTwitter,
};

export async function crawlTruck(
  truckId: string,
  platform: Platform,
  url: string
): Promise<CrawlResult> {
  const scraper = scrapers[platform];
  const result = await scraper(url);
  return {
    truckId,
    source: platform,
    sourceUrl: url,
    crawledAt: new Date().toISOString(),
    ...result,
  };
}
