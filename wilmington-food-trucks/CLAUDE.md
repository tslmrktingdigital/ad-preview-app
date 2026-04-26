# CLAUDE.md
# ILM Food Trucks — Wilmington, NC

> **This file is read automatically by Claude Code at the start of every session.**
> Keep it updated as the project evolves.

---

## Project Overview

A public mobile-first website that aggregates food truck locations, schedules, and social media posts for Wilmington, NC. It crawls food truck Facebook pages, Instagram profiles, Twitter/X accounts, and their own websites to pull schedule info and recent posts into one easy-to-read mobile site.

**Users:** Anyone in Wilmington, NC looking to find food trucks.
**Site URL:** `ilmfoodtrucks.com` (planned)
**Stack origin:** Follows the same architecture conventions as `tassel-ad-platform` (sibling directory).

---

## Tech Stack

- **Monorepo:** npm workspaces (`@wft/*` scope)
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, ISR (5-min revalidation)
- **Backend:** Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Crawler:** Playwright (headless browser for social media), Cheerio (static sites)
- **Job Queue:** BullMQ (Redis-backed) for scheduled crawls
- **Deployment:** Vercel (web), Railway or Fly.io (API + Redis + Postgres)

---

## Project Structure

```
wilmington-food-trucks/
├── CLAUDE.md                ← You are here
├── INTEGRATION_HANDOFF.md   ← Full context for handoffs / new sessions
├── packages/
│   ├── web/                 ← Next.js mobile-first frontend (port 3000)
│   ├── api/                 ← Express API + Prisma (port 3001)
│   └── crawler/             ← Playwright + Cheerio scrapers
├── shared/                  ← Shared TypeScript types (@wft/shared)
├── docs/                    ← Architecture & data flow docs
├── package.json             ← npm workspaces root
└── tsconfig.base.json
```

---

## Coding Conventions (ALWAYS FOLLOW — same as tassel-ad-platform)

- TypeScript strict mode in all packages
- Files: kebab-case (`truck-card.tsx`)
- Components: PascalCase (`TruckCard`)
- Functions/variables: camelCase (`formatTime`)
- Database tables: snake_case (`food_trucks`, `schedule_entries`)
- API routes: kebab-case (`/api/trucks`, `/api/schedule/week`)
- All API responses: `{ success: boolean, data?: T, error?: string }`
- Async/await everywhere
- Functional React components only
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`)
- No comments unless the WHY is non-obvious

---

## Key Design Decisions

1. **Crawler-first, API-optional.** We never depend on official social media APIs (expensive/restricted). We scrape public pages using Playwright with a mobile user-agent. This means data may be partial — that's expected.

2. **Known Wilmington locations are hardcoded.** The schedule parser (`packages/crawler/src/parsers/schedule-parser.ts`) matches text against a list of common Wilmington food truck spots. New locations must be added to this list.

3. **Manual override is always available.** The admin API (`POST /api/admin/schedule`) lets an admin add schedule entries manually when scraping fails or a truck posts to a platform we don't crawl.

4. **ISR (Incremental Static Regeneration) at 5 minutes.** The Next.js pages revalidate every 300 seconds. Background crawl jobs run every 4 hours. This means the site is fast (served from cache) but data can be up to 4 hours stale.

5. **Food trucks must be added manually first.** There's no auto-discovery. A truck is added via `POST /api/admin/trucks` with its social URLs, then the crawler handles the rest.

6. **No authentication in V1.** The admin API is internal-only (protect with env var or IP allowlist in production).

---

## Module Status

| Module | Status | Notes |
|--------|--------|-------|
| Monorepo scaffolding | Done | npm workspaces, shared types, tsconfig |
| Shared types | Done | `@wft/shared` — FoodTruck, ScheduleEntry, SocialPost, CrawlResult, ApiResponse |
| Database schema | Done | Prisma schema — food_trucks, schedule_entries, social_posts, crawl_logs |
| API routes | Done | /api/trucks, /api/trucks/:slug, /api/schedule, /api/schedule/week, /api/admin/* |
| Crawl queue | Done | BullMQ queue + worker skeleton |
| Crawler — website | Done | Cheerio static scraper |
| Crawler — Facebook | Done | Playwright mobile UA |
| Crawler — Instagram | Done | Playwright mobile UA |
| Crawler — Twitter | Done | Playwright desktop |
| Schedule parser | Done | Text → ScheduleEntry, knows Wilmington locations |
| Next.js frontend | Done | Layout, home (today), /trucks, /trucks/[slug], /schedule |
| TruckCard component | Done | Mobile card with location + hours |
| Admin UI | Not started | Simple form to add trucks + manual schedule entries |
| Map view | Not started | Mapbox pins for today's locations |
| Search / filter | Not started | Filter by cuisine type |
| Notifications | Not started | Push or email "your favorite truck is near you" |
| SEO / sitemap | Not started | Dynamic sitemap.xml for truck pages |
| docker-compose | Not started | Local Postgres + Redis dev environment |

---

## Build Order (Next Steps)

1. **docker-compose** — Postgres + Redis for local dev
2. **npm install + prisma migrate** — Get DB running
3. **Admin UI** — Simple Next.js form at `/admin` to add the first real trucks
4. **Seed Wilmington trucks** — Add 10–15 real Wilmington food trucks via admin
5. **Test crawlers** — Run manual crawl per truck, validate `schedule_entries` populated
6. **Map view** — Add Mapbox map to home page showing today's truck pins
7. **Filter by cuisine** — Tag chips on /trucks and home page
8. **Deploy** — Vercel (web) + Railway (API + DB + Redis)

---

## Known Wilmington Locations (in schedule-parser)

The parser knows these spots. Add new ones to `packages/crawler/src/parsers/schedule-parser.ts`:
- Greenfield Lake Park
- Wrightsville Beach
- The Cargo District
- Soda Pops
- Mayfaire Town Center
- Brooklyn Arts Center
- Wilmington Riverfront
- Castle Hayne
- Ogden Park
- Independence Mall
- Wave Transit Station

---

## Common Commands

```bash
# From wilmington-food-trucks/
npm install

# Start API dev server
npm run dev --workspace=packages/api

# Start web dev server
npm run dev --workspace=packages/web

# Start both
npm run dev

# DB migrations
npm run db:migrate

# DB studio
npm run db:studio

# Run crawler manually (once implemented)
npx tsx packages/crawler/src/crawl-truck.ts <truckId> website <url>
```

---

## Environment Variables

```
# API (packages/api/.env)
DATABASE_URL=postgresql://wft:wft@localhost:5432/wft
REDIS_URL=redis://localhost:6379
PORT=3001
FRONTEND_URL=http://localhost:3000

# Web (packages/web/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...
```

---

## Important Context for Claude Code

- **Crawlers are fragile.** Social media sites change their HTML constantly. If a scraper stops working, check the selector in the relevant scraper file. Always test with `headless: false` first.
- **The schedule parser is keyword-based.** It can't read minds. If a truck posts "We'll be at XYZ!" where XYZ is a new location, it won't be parsed until that location is added to `KNOWN_LOCATIONS`.
- **ISR means stale data is normal.** Don't add loading spinners or "live" indicators — the footer already explains data is updated every 4 hours.
- **Mobile-first is non-negotiable.** All new UI must be designed for a 390px iPhone viewport first. Test at 390px before considering desktop.
- **Keep the admin UI simple.** This is not a CMS. It's a small internal form for adding trucks and overriding schedule data. No auth drama needed in V1.

---

## Reference Documents

See `/docs/` for architecture and data flow diagrams (to be added).
