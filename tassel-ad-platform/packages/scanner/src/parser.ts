import type { CrawlResult } from './crawler.js';
import type { SchoolProfile } from '@tassel/types';
import { validateSchoolProfile } from './profiles.js';

/**
 * Parses raw crawl results into a structured SchoolProfile.
 * Uses heuristic extraction; AI-assisted parsing is handled in the API job layer.
 */
export function parseSchoolProfile(
  crawlResults: CrawlResult[],
  schoolName: string
): SchoolProfile {
  const allText = crawlResults.map((r) => r.bodyText).join('\n');
  const homePage = crawlResults[0];

  const profile: Partial<SchoolProfile> = {
    name: schoolName || extractSchoolName(homePage?.title ?? ''),
    programs: extractPrograms(allText),
    gradeLevels: extractGradeLevels(allText),
    upcomingEvents: [],
    testimonials: extractTestimonials(allText),
    accreditations: [],
    awards: [],
    location: {},
  };

  return validateSchoolProfile(profile);
}

function extractSchoolName(title: string): string {
  // Strip common suffixes like "| Home" or "- Official Website"
  return title.replace(/\s*[|\-–]\s*.+$/, '').trim() || 'Unknown School';
}

function extractPrograms(text: string): string[] {
  const keywords = ['STEM', 'arts', 'athletics', 'music', 'dual enrollment', 'AP', 'IB',
    'robotics', 'theater', 'honors', 'college prep'];
  return keywords.filter((kw) => text.toLowerCase().includes(kw.toLowerCase()));
}

function extractGradeLevels(text: string): string[] {
  const levels: string[] = [];
  if (/pre-?k|preschool|kindergarten/i.test(text)) levels.push('PreK');
  if (/elementary|grade [1-5]/i.test(text)) levels.push('Elementary');
  if (/middle school|grade [6-8]/i.test(text)) levels.push('Middle School');
  if (/high school|grade (?:9|10|11|12)/i.test(text)) levels.push('High School');
  return levels;
}

function extractTestimonials(text: string): string[] {
  // Simple heuristic: quoted strings > 50 chars
  const matches = text.match(/"([^"]{50,300})"/g) ?? [];
  return matches.slice(0, 5).map((m) => m.replace(/^"|"$/g, ''));
}
