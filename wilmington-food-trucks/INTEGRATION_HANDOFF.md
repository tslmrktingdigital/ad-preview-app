# ILM Food Trucks — Integration Handoff

> Self-contained context for any LLM, developer, or team picking up this project cold.

---

## 1. What this project is

A **public mobile-first website** that shows where food trucks are in **Wilmington, NC** today. It crawls food truck social media (Facebook, Instagram, Twitter/X) and websites on a schedule, parses location/schedule info from posts, and displays it all in one readable mobile site.

**Live data flow:**
1. Admin adds a truck via API with its social media URLs
2. BullMQ job crawls each source every 4 hours
3. Parsed schedule entries + posts stored in PostgreSQL
4. Next.js ISR pages serve cached data, revalidating every 5 minutes
5. User sees: today's truck locations, this week's schedule, per-truck detail pages

---

## 2. Technology stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Next.js 14 App Router + Tailwind | ISR, mobile-first, fast |
| Backend | Express + Prisma | Same pattern as sibling tassel-ad-platform |
| Database | PostgreSQL | Structured schedule data, easy to query by date |
| Crawler | Playwright + Cheerio | JS-heavy social sites need real browser |
| Job Queue | BullMQ (Redis) | Retry logic, scheduled crawls |
| Deployment | Vercel (web) + Railway (API) | Vercel ISR + managed Postgres/Redis |

---

## 3. Repository layout

```
wilmington-food-trucks/
├── CLAUDE.md                        ← Project context for Claude Code sessions
├── INTEGRATION_HANDOFF.md           ← This document
├── package.json                     ← npm workspaces root
├── tsconfig.base.json               ← Shared TS config
├── shared/
│   └── src/
│       └── types.ts                 ← FoodTruck, ScheduleEntry, SocialPost, CrawlResult, ApiResponse
├── packages/
│   ├── api/
│   │   ├── prisma/schema.prisma     ← DB schema (food_trucks, schedule_entries, social_posts, crawl_logs)
│   │   └── src/
│   │       ├── index.ts             ← Express app entry
│   │       ├── routes/trucks.ts     ← GET /api/trucks, GET /api/trucks/:slug
│   │       ├── routes/schedule.ts   ← GET /api/schedule, GET /api/schedule/week
│   │       ├── routes/admin.ts      ← POST /api/admin/trucks, PATCH, POST /crawl, POST /schedule
│   │       ├── jobs/crawl-queue.ts  ← BullMQ queue + worker + enqueueAllTrucks()
│   │       ├── services/crawl-service.ts ← Orchestrates crawl per truck
│   │       └── lib/prisma.ts        ← Prisma singleton
│   ├── crawler/
│   │   └── src/
│   │       ├── index.ts             ← exports crawlTruck()
│   │       ├── crawl-truck.ts       ← Routes to correct scraper by platform
│   │       ├── scrapers/
│   │       │   ├── website-scraper.ts   ← fetch + Cheerio
│   │       │   ├── facebook-scraper.ts  ← Playwright mobile UA
│   │       │   ├── instagram-scraper.ts ← Playwright mobile UA
│   │       │   └── twitter-scraper.ts   ← Playwright desktop
│   │       └── parsers/
│   │           ├── schedule-parser.ts   ← Text → ScheduleEntry (knows Wilmington locations)
│   │           └── post-parser.ts       ← Text + links → SocialPost[]
│   └── web/
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── src/
│           ├── app/
│           │   ├── layout.tsx           ← Header nav + footer
│           │   ├── page.tsx             ← Home: today's trucks with locations
│           │   ├── trucks/page.tsx      ← All trucks list
│           │   ├── trucks/[slug]/page.tsx ← Individual truck detail + schedule + posts
│           │   └── schedule/page.tsx    ← This week grouped by date
│           ├── components/
│           │   ├── truck/truck-card.tsx ← Mobile card with location + hours
│           │   └── ui/empty-state.tsx
│           └── lib/
│               ├── api.ts              ← Typed fetch wrappers for all API endpoints
│               └── utils.ts            ← cn(), formatTime(), formatDate()
```

---

## 4. Data contracts

### FoodTruck (stored in `food_trucks` table)
```typescript
{
  id: string;           // cuid
  name: string;
  slug: string;         // URL-safe, unique
  description?: string;
  cuisineTypes: string[];
  logoUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
}
```

### ScheduleEntry (stored in `schedule_entries` table)
```typescript
{
  id: string;
  truckId: string;
  date: Date;           // date only (no time)
  startTime: string;    // "HH:MM" 24h
  endTime: string;      // "HH:MM" 24h
  locationName: string; // e.g. "Greenfield Lake Park"
  address: string;
  lat?: number;
  lng?: number;
  notes?: string;
  sourceUrl?: string;   // where it was scraped from
}
```

### API response envelope
All endpoints return: `{ success: boolean, data?: T, error?: string }`

---

## 5. API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /api/trucks | All active trucks + today's schedule + 3 recent posts |
| GET | /api/trucks/:slug | Single truck + 7-day schedule + 10 recent posts |
| GET | /api/schedule | All schedule entries for today (optional `?date=YYYY-MM-DD`) |
| GET | /api/schedule/week | Next 7 days grouped by date |
| POST | /api/admin/trucks | Create a truck |
| PATCH | /api/admin/trucks/:id | Update a truck |
| POST | /api/admin/trucks/:id/crawl | Trigger immediate crawl |
| POST | /api/admin/schedule | Manually add a schedule entry |

---

## 6. Crawler architecture

`crawlTruck(truckId, platform, url)` is the main entry point. It:
1. Calls the right scraper for the platform
2. Each scraper returns `{ scheduleEntries, posts, errors }`
3. `scheduleEntries` are detected by matching text against `KNOWN_LOCATIONS` in Wilmington
4. Results are upserted to the database by `crawl-service.ts`

**Adding a new Wilmington location to the parser:**
```typescript
// packages/crawler/src/parsers/schedule-parser.ts
{ pattern: /new\s*location\s*name/i, name: 'Display Name', address: 'Full Address, Wilmington, NC XXXXX' }
```

---

## 7. Frontend pages

| Route | Data | Revalidation |
|-------|------|-------------|
| `/` | Today's trucks with locations | 5 min ISR |
| `/trucks` | All trucks | 5 min ISR |
| `/trucks/[slug]` | Single truck + week schedule + posts | 5 min ISR |
| `/schedule` | Next 7 days grouped by date | 5 min ISR |

---

## 8. What's NOT built yet

- **Admin UI** (`/admin` page with forms) — use API directly for now
- **Map view** — Mapbox pins for today's locations
- **Search / filter by cuisine** — filter chips on home + /trucks
- **docker-compose** — local Postgres + Redis
- **Push notifications** — "your favorite truck is near you"
- **Sitemap.xml** — dynamic SEO sitemap
- **Auth** — admin endpoints are unprotected (add IP allowlist or basic auth before deploy)

---

## 9. Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Web (`@wft/web`) | Vercel | Framework: Next.js; env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN` |
| API (`@wft/api`) | Railway / Fly.io | env: `DATABASE_URL`, `REDIS_URL`, `PORT`, `FRONTEND_URL` |
| PostgreSQL | Railway / Supabase | — |
| Redis | Railway / Upstash | — |

---

## 10. Local development

```bash
cd wilmington-food-trucks

# Start Postgres + Redis (docker-compose not yet written — run manually)
# docker-compose up -d

npm install
npm run db:migrate

# Terminal 1
npm run dev --workspace=packages/api   # :3001

# Terminal 2
npm run dev --workspace=packages/web   # :3000
```

---

*End of handoff — this document plus CLAUDE.md are sufficient to resume work in any session.*
