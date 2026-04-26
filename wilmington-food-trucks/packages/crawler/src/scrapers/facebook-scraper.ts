import { chromium } from 'playwright';
import { parseScheduleText } from '../parsers/schedule-parser.js';
import { parsePostsFromText } from '../parsers/post-parser.js';
import type { CrawlResult } from '@wft/shared';

type ScraperResult = Omit<CrawlResult, 'truckId' | 'source' | 'sourceUrl' | 'crawledAt'>;

export async function scrapeFacebook(url: string): Promise<ScraperResult> {
  const errors: string[] = [];
  const scheduleEntries: ScraperResult['scheduleEntries'] = [];
  const posts: ScraperResult['posts'] = [];

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      viewport: { width: 390, height: 844 },
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });

    // Dismiss cookie/login dialogs if present
    for (const selector of ['[aria-label="Close"]', '[data-testid="cookie-policy-manage-dialog-accept-button"]']) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible()) await btn.click().catch(() => {});
    }

    await page.waitForTimeout(2000);

    // Grab all visible post text
    const postTexts = await page.$$eval('[data-ad-comet-preview="message"], [data-testid="post_message"], [dir="auto"]', (els) =>
      els.map((el) => (el as HTMLElement).innerText).filter((t) => t.length > 20)
    );

    for (const text of postTexts.slice(0, 10)) {
      const parsed = parseScheduleText(text, url);
      scheduleEntries.push(...parsed);

      const postLinks = await page.$$eval('a[href*="/posts/"], a[href*="/permalink/"]', (els) =>
        els.map((el) => (el as HTMLAnchorElement).href)
      );

      if (postLinks[0]) {
        posts.push({
          platform: 'facebook',
          postUrl: postLinks[0],
          text,
          imageUrl: undefined,
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
