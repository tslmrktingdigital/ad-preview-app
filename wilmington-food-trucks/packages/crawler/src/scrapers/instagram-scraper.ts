import { chromium } from 'playwright';
import { parseScheduleText } from '../parsers/schedule-parser.js';
import type { CrawlResult } from '@wft/shared';

type ScraperResult = Omit<CrawlResult, 'truckId' | 'source' | 'sourceUrl' | 'crawledAt'>;

export async function scrapeInstagram(url: string): Promise<ScraperResult> {
  const errors: string[] = [];
  const scheduleEntries: ScraperResult['scheduleEntries'] = [];
  const posts: ScraperResult['posts'] = [];

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 },
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.waitForTimeout(3000);

    // Bio text often contains schedule/location info
    const bioText = await page.$eval('header section', (el) => (el as HTMLElement).innerText).catch(() => '');
    if (bioText) {
      scheduleEntries.push(...parseScheduleText(bioText, url));
    }

    // Recent post captions
    const captions = await page.$$eval(
      'article [role="button"] span, ._aacl',
      (els) => els.map((el) => (el as HTMLElement).innerText).filter((t) => t.length > 20)
    );

    const postLinks = await page.$$eval(
      'article a[href*="/p/"]',
      (els) => [...new Set(els.map((el) => (el as HTMLAnchorElement).href))]
    );

    for (let i = 0; i < Math.min(captions.length, 5, postLinks.length); i++) {
      scheduleEntries.push(...parseScheduleText(captions[i]!, url));
      posts.push({
        platform: 'instagram',
        postUrl: postLinks[i]!,
        text: captions[i]!,
        imageUrl: undefined,
      });
    }
  } catch (err) {
    errors.push((err as Error).message);
  } finally {
    await browser?.close();
  }

  return { scheduleEntries, posts, errors };
}
