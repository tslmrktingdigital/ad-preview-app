import { TASSEL_STYLE_GUIDE } from '../style-guide.js';
import type { SchoolProfile, CampaignBrief } from '@tassel/types';

export const AD_GENERATION_PROMPT_VERSION = '1.1';

export function buildAdGenerationPrompt(
  schoolProfile: SchoolProfile,
  campaignBrief: CampaignBrief
): string {
  const isChristian =
    !!schoolProfile.religiousAffiliation ||
    !!schoolProfile.denomination;

  const locationStr = [schoolProfile.location.city, schoolProfile.location.state]
    .filter(Boolean)
    .join(', ');

  const eventsStr = schoolProfile.upcomingEvents
    .map((e) => `${e.name}${e.date ? ` (${e.date})` : ''}${e.description ? ` — ${e.description}` : ''}`)
    .join('\n  - ');

  return `
You are an expert ad copywriter for Tassel Marketing, a digital marketing agency that specializes in enrollment campaigns for private and Christian schools.

${TASSEL_STYLE_GUIDE}

---

## School Profile

**Name:** ${schoolProfile.name}
${schoolProfile.tagline ? `**Tagline:** ${schoolProfile.tagline}` : ''}
${schoolProfile.missionStatement ? `**Mission:** ${schoolProfile.missionStatement}` : ''}
**Type:** ${isChristian ? `Christian school${schoolProfile.denomination ? ` (${schoolProfile.denomination})` : ''}` : 'Private school'}
**Grades:** ${schoolProfile.gradeLevels.join(', ') || 'Not specified'}
**Location:** ${locationStr || 'Not specified'}
${schoolProfile.studentTeacherRatio ? `**Student-to-Teacher Ratio:** ${schoolProfile.studentTeacherRatio}` : ''}
**Programs & Differentiators:** ${schoolProfile.programs.join(', ') || 'Not specified'}
${schoolProfile.accreditations.length > 0 ? `**Accreditations:** ${schoolProfile.accreditations.join(', ')}` : ''}
${schoolProfile.awards.length > 0 ? `**Awards:** ${schoolProfile.awards.join(', ')}` : ''}
${schoolProfile.tuitionRange ? `**Tuition:** ${schoolProfile.tuitionRange}` : ''}
${schoolProfile.financialAid ? `**Financial Aid:** ${schoolProfile.financialAid}` : ''}
${schoolProfile.testimonials.length > 0
  ? `**Parent Testimonials:**\n  - "${schoolProfile.testimonials.slice(0, 3).join('"\n  - "')}"`
  : ''}
${schoolProfile.upcomingEvents.length > 0
  ? `**Upcoming Events:**\n  - ${eventsStr}`
  : ''}

---

## Campaign Brief

**Goal:** ${campaignBrief.goal}
**Season:** ${campaignBrief.season}
${campaignBrief.targetDemographic ? `**Target Demographic:** ${campaignBrief.targetDemographic}` : ''}
${campaignBrief.messagingEmphasis ? `**Messaging Emphasis:** ${campaignBrief.messagingEmphasis}` : ''}
${campaignBrief.toneOverrides ? `**Tone Notes:** ${campaignBrief.toneOverrides}` : ''}

---

## Task

Generate exactly **4 ad variations** for this campaign. Produce two variations that lean into faith/values messaging and two that focus on academic excellence and community — so the team can A/B test both angles.

For each variation return a JSON object with these exact fields:

\`\`\`
{
  "primaryText": string,       // Ad body copy, 2–4 sentences, under 150 words. Lead with the child's experience.
  "headline": string,          // Short and punchy, under 8 words
  "description": string,       // One sentence of supporting text (shown below headline)
  "cta": string,               // One of: LEARN_MORE, APPLY_NOW, SIGN_UP, CONTACT_US
  "imageBrief": string,        // 2–3 sentence description of the ideal photo or video scene
  "hashtags": string[],        // 3–5 Instagram hashtags including the school name
  "targetingParams": {
    "ageMin": number,
    "ageMax": number,
    "locationRadiusMiles": number,
    "interests": string[]      // 3–6 Facebook interest targeting keywords
  }
}
\`\`\`

Return **only** a valid JSON array of 4 objects. No markdown fences, no explanation, no extra text.
`.trim();
}
