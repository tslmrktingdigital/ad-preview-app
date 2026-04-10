/**
 * CLI: generate ad variations for a school profile.
 *
 * Usage:
 *   npx tsx packages/content-engine/src/run-generate.ts
 *   npx tsx packages/content-engine/src/run-generate.ts tour
 *
 * Requires ANTHROPIC_API_KEY in the environment (or a .env file).
 */

import 'dotenv/config';
import { generateAdVariations } from './generator.js';
import {
  easternChristianProfile,
  easternChristianOpenHouseBrief,
  easternChristianTourBrief,
} from './fixtures/eastern-christian.js';
import type { AdVariation } from '@tassel/types';

async function main() {
  const mode = process.argv[2] ?? 'open_house';
  const brief = mode === 'tour' ? easternChristianTourBrief : easternChristianOpenHouseBrief;

  console.log(`\n🏫  School:   ${easternChristianProfile.name}`);
  console.log(`🎯  Campaign: ${brief.name}`);
  console.log(`📅  Season:   ${brief.season}`);
  console.log('\nGenerating ad variations via Claude API...\n');

  const startMs = Date.now();
  const result = await generateAdVariations(easternChristianProfile, brief);
  const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);

  console.log(
    `✅  Generated ${result.variations.length} variations in ${elapsed}s` +
    ` (model: ${result.model}, tokens: ${result.usage.inputTokens} in / ${result.usage.outputTokens} out)\n`
  );
  console.log('─'.repeat(70));

  result.variations.forEach((ad, i) => {
    printAd(i + 1, ad);
  });

  console.log(`\nPrompt version: ${result.promptVersion}`);
}

function printAd(n: number, ad: AdVariation) {
  console.log(`\n## Ad ${n}`);
  console.log(`\nPrimary Text:\n${ad.primaryText}`);
  console.log(`\nHeadline:    ${ad.headline}`);
  if (ad.description) console.log(`Description: ${ad.description}`);
  console.log(`CTA:         ${ad.cta}`);
  console.log(`\nImage Brief:\n${ad.imageBrief}`);
  console.log(`\nHashtags: ${ad.hashtags.join('  ')}`);
  console.log(
    `Targeting: ages ${ad.targetingParams.ageMin}–${ad.targetingParams.ageMax},` +
    ` ${ad.targetingParams.locationRadiusMiles}mi radius,` +
    ` interests: ${ad.targetingParams.interests.join(', ')}`
  );
  console.log('─'.repeat(70));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
