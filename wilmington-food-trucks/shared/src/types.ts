export type CuisineType =
  | 'american'
  | 'bbq'
  | 'mexican'
  | 'seafood'
  | 'asian'
  | 'italian'
  | 'caribbean'
  | 'mediterranean'
  | 'vegan'
  | 'desserts'
  | 'coffee'
  | 'other';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface ScheduleEntry {
  id: string;
  truckId: string;
  date: string;           // ISO date string YYYY-MM-DD
  startTime: string;      // HH:MM 24h
  endTime: string;        // HH:MM 24h
  locationName: string;   // e.g. "Greenfield Lake Park"
  address: string;
  lat?: number;
  lng?: number;
  notes?: string;
  sourceUrl?: string;     // where this was scraped from
  scrapedAt: string;      // ISO datetime
}

export interface SocialPost {
  id: string;
  truckId: string;
  platform: 'facebook' | 'instagram' | 'twitter';
  postUrl: string;
  text: string;
  imageUrl?: string;
  postedAt?: string;      // ISO datetime if parseable
  scrapedAt: string;
}

export interface FoodTruck {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cuisineTypes: CuisineType[];
  menuItems: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  phone?: string;
  email?: string;
  socialLinks: SocialLinks;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodTruckWithSchedule extends FoodTruck {
  upcomingSchedule: ScheduleEntry[];
  recentPosts: SocialPost[];
  todayLocation?: ScheduleEntry;
}

// API response envelope (matches tassel-ad-platform convention)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// Crawler output shape
export interface CrawlResult {
  truckId: string;
  source: 'facebook' | 'instagram' | 'twitter' | 'website';
  sourceUrl: string;
  scheduleEntries: Omit<ScheduleEntry, 'id' | 'truckId' | 'scrapedAt'>[];
  posts: Omit<SocialPost, 'id' | 'truckId' | 'scrapedAt'>[];
  errors: string[];
  crawledAt: string;
}
