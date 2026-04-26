import * as cheerio from 'cheerio';
import { parseScheduleText } from '../parsers/schedule-parser.js';
import type { CrawlResult } from '@wft/shared';

type ScraperResult = Omit<CrawlResult, 'truckId' | 'source' | 'sourceUrl' | 'crawledAt'>;

export async function scrapeWebsite(url: string): Promise<ScraperResult> {
  const errors: string[] = [];
  const scheduleEntries: ScraperResult['scheduleEntries'] = [];
  const posts: ScraperResult['posts'] = [];

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WilmingtonFoodTrucks/1.0 (+https://ilmfoodtrucks.com)' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      errors.push(`HTTP ${res.status} from ${url}`);
      return { scheduleEntries, posts, errors };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove nav/footer noise
    $('nav, footer, script, style, header').remove();

    // Look for schedule-related sections by common class/id names
    const scheduleSelectors = [
      '[class*="schedule"]',
      '[class*="location"]',
      '[class*="calendar"]',
      '[id*="schedule"]',
      '[id*="location"]',
      'section',
      'article',
      'main',
    ];

    let scheduleText = '';
    for (const sel of scheduleSelectors) {
      const el = $(sel).first();
      if (el.length && el.text().trim().length > 50) {
        scheduleText = el.text();
        break;
      }
    }

    if (!scheduleText) {
      scheduleText = $('body').text();
    }

    const parsed = parseScheduleText(scheduleText, url);
    scheduleEntries.push(...parsed);
  } catch (err) {
    errors.push((err as Error).message);
  }

  return { scheduleEntries, posts, errors };
}
