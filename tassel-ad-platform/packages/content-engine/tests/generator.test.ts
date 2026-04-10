import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AdVariation } from '@tassel/types';

// Never make real API calls in tests — mock the Anthropic SDK.
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        model: 'claude-opus-4-5',
        usage: { input_tokens: 800, output_tokens: 600 },
        content: [
          {
            type: 'text',
            text: JSON.stringify(makeMockVariations(4)),
          },
        ],
      }),
    },
  })),
}));

import { generateAdVariations } from '../src/generator.js';
import { easternChristianProfile, easternChristianOpenHouseBrief } from '../src/fixtures/eastern-christian.js';

function makeMockVariations(count: number): AdVariation[] {
  return Array.from({ length: count }, (_, i) => ({
    primaryText: `Your child deserves an education that shapes both mind and character. Eastern Christian School offers ${i + 1} unique programs.`,
    headline: `Discover Eastern Christian`,
    description: 'Schedule your visit today.',
    cta: 'SIGN_UP' as const,
    imageBrief: 'Families walking through a bright, welcoming campus with staff greeting them warmly.',
    hashtags: ['#EasternChristian', '#PrivateSchool', '#NJSchools'],
    targetingParams: {
      ageMin: 28,
      ageMax: 55,
      locationRadiusMiles: 15,
      interests: ['private education', 'Christian school', 'parenting'],
    },
  }));
}

describe('generateAdVariations', () => {
  it('returns 4 variations with all required fields', async () => {
    const result = await generateAdVariations(easternChristianProfile, easternChristianOpenHouseBrief);
    expect(result.variations).toHaveLength(4);
    expect(result.promptVersion).toBe('1.1');
    expect(result.model).toBe('claude-opus-4-5');
  });

  it('each variation has primaryText, headline, cta, imageBrief, hashtags, and targetingParams', async () => {
    const result = await generateAdVariations(easternChristianProfile, easternChristianOpenHouseBrief);
    for (const ad of result.variations) {
      expect(ad.primaryText.length).toBeGreaterThan(10);
      expect(ad.headline.length).toBeGreaterThan(2);
      expect(['LEARN_MORE', 'APPLY_NOW', 'SIGN_UP', 'CONTACT_US']).toContain(ad.cta);
      expect(ad.imageBrief.length).toBeGreaterThan(10);
      expect(ad.hashtags.length).toBeGreaterThanOrEqual(1);
      expect(ad.targetingParams.ageMin).toBeGreaterThanOrEqual(18);
      expect(ad.targetingParams.ageMax).toBeLessThanOrEqual(65);
    }
  });

  it('reports token usage', async () => {
    const result = await generateAdVariations(easternChristianProfile, easternChristianOpenHouseBrief);
    expect(result.usage.inputTokens).toBeGreaterThan(0);
    expect(result.usage.outputTokens).toBeGreaterThan(0);
  });
});

describe('parseAndValidate (via generateAdVariations)', () => {
  it('strips markdown code fences if Claude wraps the JSON', async () => {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const instance = new (Anthropic as any)();
    instance.messages.create.mockResolvedValueOnce({
      model: 'claude-opus-4-5',
      usage: { input_tokens: 100, output_tokens: 100 },
      content: [
        {
          type: 'text',
          // Claude sometimes wraps output in markdown fences
          text: '```json\n' + JSON.stringify(makeMockVariations(4)) + '\n```',
        },
      ],
    });

    const result = await generateAdVariations(easternChristianProfile, easternChristianOpenHouseBrief);
    expect(result.variations).toHaveLength(4);
  });
});
