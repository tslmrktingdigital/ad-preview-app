import { z } from 'zod';
import type { AdVariation } from '@tassel/types';

const adVariationSchema = z.object({
  primaryText: z.string().min(10).max(1000),
  headline: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  cta: z.enum(['LEARN_MORE', 'APPLY_NOW', 'SIGN_UP', 'CONTACT_US', 'GET_DIRECTIONS', 'BOOK_TRAVEL']),
  imageBrief: z.string().min(10),
  hashtags: z.array(z.string()).min(1).max(10),
  targetingParams: z.object({
    ageMin: z.number().int().min(18).max(65),
    ageMax: z.number().int().min(18).max(65),
    locationRadiusMiles: z.number().int().min(1).max(100),
    interests: z.array(z.string()).min(1),
  }),
});

const adVariationsArraySchema = z
  .array(adVariationSchema)
  .min(1)
  .max(10);

export function validateAdVariations(data: unknown): AdVariation[] {
  const result = adVariationsArraySchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  [${i.path.join('.')}] ${i.message}`)
      .join('\n');
    throw new Error(`Ad variations failed validation:\n${issues}`);
  }
  return result.data as AdVariation[];
}
