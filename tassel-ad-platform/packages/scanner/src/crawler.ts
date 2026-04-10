import { chromium, type Browser, type Page } from 'playwright';

const MAX_PAGES = 20;

export interface CrawlResult {
  url: string;
  title: string;
  bodyText: string;
  links: string[];
}

export async function crawlWebsite(startUrl: string): Promise<CrawlResult[]> {
  const browser = await chromium.launch({ headless: true });
  const results: CrawlResult[] = [];
  const visited = new Set<string>();
  const queue = [startUrl];

  try {
    const context = await browser.newContext({
      userAgent: 'TasselBot/1.0 (school profile scanner)',
    });

    while (queue.length > 0 && results.length < MAX_PAGES) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        const result = await extractPageData(page, startUrl);
        results.push({ url, ...result });

        // Queue unvisited internal links
        for (const link of result.links) {
          if (!visited.has(link)) queue.push(link);
        }
      } catch (err) {
        console.warn(`Failed to crawl ${url}:`, err);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

async function extractPageData(
  page: Page,
  baseUrl: string
): Promise<Omit<CrawlResult, 'url'>> {
  const title = await page.title();
  const bodyText = await page.locator('body').innerText().catch(() => '');

  const origin = new URL(baseUrl).origin;
  const links = await page.$$eval('a[href]', (anchors, origin) =>
    anchors
      .map((a) => {
        try {
          const url = new URL((a as HTMLAnchorElement).href, origin);
          return url.origin === origin ? url.href : null;
        } catch {
          return null;
        }
      })
      .filter((href): href is string => href !== null),
    origin
  );

  return { title, bodyText, links: [...new Set(links)] };
}
