import { describe, it, expect, vi } from 'vitest';

// Tests for the content engine use fixture data — never real API calls in tests.
// Mock the Anthropic SDK before importing the generator.

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        model: 'claude-opus-4-6',
        content: [{
          type: 'text',
          text: JSON.stringify([
            {
              primaryText: 'Test ad copy for Grace Academy.',
              headline: 'Experience Grace Academy',
              description: 'Visit our campus today.',
              cta: 'SIGN_UP',
              imageBrief: 'Welcoming school entrance with families.',
              hashtags: ['#GraceAcademy', '#PrivateSchool'],
              targetingParams: { ageMin: 28, ageMax: 65, locationRadiusMiles: 15, interests: ['private education'] },
            },
          ]),
        }],
      }),
    },
  })),
}));

import { generateAdVariations } from '../src/generator.js';

const mockProfile = {
  name: 'Grace Academy',
  gradeLevels: ['Elementary', 'High School'],
  programs: ['STEM', 'arts'],
  testimonials: [],
  upcomingEvents: [],
  accreditations: [],
  awards: [],
  location: { city: 'Austin', state: 'TX' },
};

const mockBrief = {
  clientId: 'test-client',
  name: 'Spring Open House',
  goal: 'open_house' as const,
  season: 'open_house' as const,
};

describe('generateAdVariations', () => {
  it('returns ad variations with required fields', async () => {
    const result = await generateAdVariations(mockProfile, mockBrief);
    expect(result.variations).toHaveLength(1);
    expect(result.variations[0].headline).toBe('Experience Grace Academy');
    expect(result.promptVersion).toBe('1.0');
  });
});
