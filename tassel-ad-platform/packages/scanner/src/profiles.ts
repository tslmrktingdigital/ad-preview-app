import { z } from 'zod';
import type { SchoolProfile } from '@tassel/types';

export const schoolProfileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  missionStatement: z.string().optional(),
  gradeLevels: z.array(z.string()).default([]),
  religiousAffiliation: z.string().optional(),
  denomination: z.string().optional(),
  tuitionRange: z.string().optional(),
  financialAid: z.string().optional(),
  programs: z.array(z.string()).default([]),
  testimonials: z.array(z.string()).default([]),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).default({}),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
  branding: z.object({
    logoUrl: z.string().optional(),
    primaryColors: z.array(z.string()).optional(),
  }).optional(),
  upcomingEvents: z.array(z.object({
    name: z.string(),
    date: z.string().optional(),
    description: z.string().optional(),
  })).default([]),
  accreditations: z.array(z.string()).default([]),
  studentTeacherRatio: z.string().optional(),
  awards: z.array(z.string()).default([]),
});

export function validateSchoolProfile(data: unknown): SchoolProfile {
  return schoolProfileSchema.parse(data) as SchoolProfile;
}
