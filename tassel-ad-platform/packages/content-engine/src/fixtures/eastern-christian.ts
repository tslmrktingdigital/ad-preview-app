import type { SchoolProfile, CampaignBrief } from '@tassel/types';

/**
 * School profile for Eastern Christian School — extracted from live scan
 * of easternchristian.org on 2026-04-10. Manually enriched with
 * details from the site that the heuristic parser doesn't yet capture.
 */
export const easternChristianProfile: SchoolProfile = {
  name: 'Eastern Christian School',
  tagline: 'Educating for Eternity',
  missionStatement:
    'Eastern Christian School provides a Christ-centered education that equips students to serve God and impact the world.',
  religiousAffiliation: 'Christian',
  denomination: 'Reformed Christian',
  gradeLevels: ['PreK', 'Elementary', 'Middle School', 'High School'],
  programs: [
    'AP courses',
    'honors',
    'arts',
    'athletics',
    'music',
    'STEM',
    'college counseling',
    'Eagles Camps',
  ],
  location: {
    city: 'North Haledon',
    state: 'NJ',
    address: 'Serving Midland Park, Wyckoff, and North Haledon',
  },
  contact: {
    website: 'https://www.easternchristian.org',
  },
  upcomingEvents: [],
  testimonials: [],
  accreditations: [],
  awards: [],
};

export const easternChristianOpenHouseBrief: CampaignBrief = {
  clientId: 'eastern-christian',
  name: 'Spring Enrollment — Open House',
  goal: 'open_house',
  season: 'enrollment_deadline',
  targetDemographic: 'Parents of children ages 3–18 within 15 miles of North Haledon, NJ',
  messagingEmphasis:
    'Faith-integrated academics, strong college prep, and a welcoming community where kids thrive spiritually and academically.',
};

export const easternChristianTourBrief: CampaignBrief = {
  clientId: 'eastern-christian',
  name: 'Schedule a Tour',
  goal: 'tour_booking',
  season: 'enrollment_deadline',
  targetDemographic: 'Parents of children ages 3–18 within 15 miles of North Haledon, NJ',
  messagingEmphasis:
    'Come see campus in person — the best way to know if EC is the right fit.',
};
