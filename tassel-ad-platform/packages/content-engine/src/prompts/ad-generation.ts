import { TASSEL_STYLE_GUIDE } from '../style-guide.js';
import type { SchoolProfile, CampaignBrief } from '@tassel/types';

export const AD_GENERATION_PROMPT_VERSION = '1.0';

export function buildAdGenerationPrompt(
  schoolProfile: SchoolProfile,
  campaignBrief: CampaignBrief
): string {
  return `
You are an expert ad copywriter for Tassel Marketing, a digital marketing agency specializing in private and Christian school enrollment campaigns.

## Style Guide
${TASSEL_STYLE_GUIDE}

## School Profile
School Name: ${schoolProfile.name}
${schoolProfile.tagline ? `Tagline: ${schoolProfile.tagline}` : ''}
${schoolProfile.missionStatement ? `Mission: ${schoolProfile.missionStatement}` : ''}
Grade Levels: ${schoolProfile.gradeLevels.join(', ') || 'Not specified'}
${schoolProfile.religiousAffiliation ? `Religious Affiliation: ${schoolProfile.religiousAffiliation}` : ''}
Programs & Differentiators: ${schoolProfile.programs.join(', ') || 'Not specified'}
Location: ${[schoolProfile.location.city, schoolProfile.location.state].filter(Boolean).join(', ') || 'Not specified'}
${schoolProfile.testimonials.length > 0 ? `Sample Testimonial: "${schoolProfile.testimonials[0]}"` : ''}
${schoolProfile.upcomingEvents.length > 0 ? `Upcoming Events: ${schoolProfile.upcomingEvents.map((e) => `${e.name}${e.date ? ` on ${e.date}` : ''}`).join(', ')}` : ''}

## Campaign Brief
Goal: ${campaignBrief.goal}
Season: ${campaignBrief.season}
${campaignBrief.targetDemographic ? `Target Demographic: ${campaignBrief.targetDemographic}` : ''}
${campaignBrief.messagingEmphasis ? `Messaging Emphasis: ${campaignBrief.messagingEmphasis}` : ''}
${campaignBrief.toneOverrides ? `Tone Notes: ${campaignBrief.toneOverrides}` : ''}

## Task
Generate 4 ad variations for this campaign. For each variation, produce:
- primaryText: compelling ad copy (under 150 words)
- headline: punchy, under 8 words
- description: optional secondary text (1 sentence)
- cta: one of LEARN_MORE, APPLY_NOW, SIGN_UP, CONTACT_US
- imageBrief: a detailed description of the ideal photo or video scene
- hashtags: 3–5 Instagram hashtags
- targetingParams: recommended age range and interests

Return a JSON array of exactly 4 ad variation objects. No markdown, no explanation — only the JSON array.
`.trim();
}
