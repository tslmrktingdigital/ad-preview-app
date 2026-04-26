import { chromium } from 'playwright';
import { parseScheduleText } from '../parsers/schedule-parser.js';
import type { CrawlResult } from '@wft/shared';

type ScraperResult = Omit<CrawlResult, 'truckId' | 'source' | 'sourceUrl' | 'crawledAt'>;

export async function scrapeTwitter(url: string): Promise<ScraperResult> {
  const errors: string[] = [];
  const scheduleEntries: ScraperResult['scheduleEntries'] = [];
  const posts: ScraperResult['posts'] = [];

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.waitForTimeout(3000);

    // Tweets
    const tweets = await page.$$eval('[data-testid="tweetText"]', (els) =>
      els.map((el) => (el as HTMLElement).innerText)
    );

    const tweetLinks = await page.$$eval(
      'a[href*="/status/"]',
      (els) => [...new Set(els.map((el) => (el as HTMLAnchorElement).href))].filter((h) => h.includes('/status/'))
    );

    for (let i = 0; i < Math.min(tweets.length, 10); i++) {
      scheduleEntries.push(...parseScheduleText(tweets[i]!, url));
      if (tweetLinks[i]) {
        posts.push({
          platform: 'twitter',
          postUrl: tweetLinks[i]!,
          text: tweets[i]!,
        });
      }
    }
  } catch (err) {
    errors.push((err as Error).message);
  } finally {
    await browser?.close();
  }

  return { scheduleEntries, posts, errors };
}
