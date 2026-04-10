import { crawlWebsite } from './crawler.js';
import { parseSchoolProfile } from './parser.js';

async function main() {
  const url = process.argv[2] ?? 'https://www.easternchristian.org/';
  console.log(`Scanning: ${url}\n`);

  const results = await crawlWebsite(url);
  console.log(`Crawled ${results.length} pages:`);
  results.forEach((r) => console.log(` - ${r.url} (${r.bodyText.length} chars)`));

  const profile = parseSchoolProfile(results, '');
  console.log('\n--- School Profile ---');
  console.log(JSON.stringify(profile, null, 2));
}

main().catch(console.error);
