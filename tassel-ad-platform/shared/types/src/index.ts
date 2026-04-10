// Shared types across all packages

export type ApiResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UserRole = 'admin' | 'specialist' | 'viewer';

export type AdStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';

export type CampaignGoal =
  | 'enrollment'
  | 'open_house'
  | 'brand_awareness'
  | 'tour_booking'
  | 'engagement';

export type CampaignSeason =
  | 'back_to_school'
  | 'open_house'
  | 'enrollment_deadline'
  | 'graduation'
  | 'general';

export type MetaPlacement = 'facebook_feed' | 'instagram_feed' | 'instagram_stories';

export type AdCallToAction =
  | 'LEARN_MORE'
  | 'APPLY_NOW'
  | 'SIGN_UP'
  | 'CONTACT_US'
  | 'GET_DIRECTIONS'
  | 'BOOK_TRAVEL';

// School Profile — output of the scanner module
export interface SchoolProfile {
  name: string;
  tagline?: string;
  missionStatement?: string;
  gradeLevels: string[];
  religiousAffiliation?: string;
  denomination?: string;
  tuitionRange?: string;
  financialAid?: string;
  programs: string[];
  testimonials: string[];
  location: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  branding?: {
    logoUrl?: string;
    primaryColors?: string[];
  };
  upcomingEvents: Array<{
    name: string;
    date?: string;
    description?: string;
  }>;
  accreditations: string[];
  studentTeacherRatio?: string;
  awards: string[];
}

// Campaign brief — input to the content engine
export interface CampaignBrief {
  clientId: string;
  name: string;
  goal: CampaignGoal;
  season: CampaignSeason;
  targetDemographic?: string;
  messagingEmphasis?: string;
  toneOverrides?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

// Individual ad variation — output of content engine
export interface AdVariation {
  primaryText: string;
  headline: string;
  description?: string;
  cta: AdCallToAction;
  imageBrief: string;
  hashtags: string[];
  targetingParams: {
    ageMin: number;
    ageMax: number;
    locationRadiusMiles: number;
    interests: string[];
  };
}
