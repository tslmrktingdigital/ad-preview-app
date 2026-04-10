import Anthropic from '@anthropic-ai/sdk';
import { buildAdGenerationPrompt, AD_GENERATION_PROMPT_VERSION } from './prompts/index.js';
import type { SchoolProfile, CampaignBrief, AdVariation } from '@tassel/types';

const anthropic = new Anthropic();

export interface GenerationResult {
  variations: AdVariation[];
  promptVersion: string;
  model: string;
}

export async function generateAdVariations(
  schoolProfile: SchoolProfile,
  campaignBrief: CampaignBrief
): Promise<GenerationResult> {
  const prompt = buildAdGenerationPrompt(schoolProfile, campaignBrief);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  let variations: AdVariation[];
  try {
    variations = JSON.parse(content.text) as AdVariation[];
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${content.text.slice(0, 200)}`);
  }

  if (!Array.isArray(variations) || variations.length === 0) {
    throw new Error('Claude returned no ad variations');
  }

  return {
    variations,
    promptVersion: AD_GENERATION_PROMPT_VERSION,
    model: message.model,
  };
}
