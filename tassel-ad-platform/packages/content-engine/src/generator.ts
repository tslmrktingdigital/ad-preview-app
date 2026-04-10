import Anthropic from '@anthropic-ai/sdk';
import { buildAdGenerationPrompt, AD_GENERATION_PROMPT_VERSION } from './prompts/index.js';
import { validateAdVariations } from './validation.js';
import type { SchoolProfile, CampaignBrief, AdVariation } from '@tassel/types';

const MODEL = 'claude-opus-4-5';
const MAX_RETRIES = 3;

const anthropic = new Anthropic();

export interface GenerationResult {
  variations: AdVariation[];
  promptVersion: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

export async function generateAdVariations(
  schoolProfile: SchoolProfile,
  campaignBrief: CampaignBrief
): Promise<GenerationResult> {
  const prompt = buildAdGenerationPrompt(schoolProfile, campaignBrief);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected non-text response from Claude API');
      }

      const variations = parseAndValidate(content.text);

      return {
        variations,
        promptVersion: AD_GENERATION_PROMPT_VERSION,
        model: message.model,
        usage: {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
        },
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        const delay = 1000 * attempt; // 1s, 2s
        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error('Generation failed after all retries');
}

/**
 * Parses the raw text from Claude into validated AdVariation[].
 * Handles cases where Claude wraps JSON in markdown code fences.
 */
function parseAndValidate(raw: string): AdVariation[] {
  // Strip markdown code fences if present (```json ... ```)
  const stripped = raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    // Try to extract the first JSON array from the text as a fallback
    const match = stripped.match(/\[[\s\S]*\]/);
    if (!match) {
      throw new Error(
        `Claude response is not valid JSON. First 300 chars: ${raw.slice(0, 300)}`
      );
    }
    parsed = JSON.parse(match[0]);
  }

  return validateAdVariations(parsed);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
