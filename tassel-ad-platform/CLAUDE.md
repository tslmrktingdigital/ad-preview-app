# CLAUDE.md
# Tassel Marketing — Social Media Ad Platform

> **This file is read automatically by Claude Code at the start of every session.**
> Keep it updated as the project evolves.

---

## Project Overview

Internal web application for Tassel Marketing that automates the creation and publishing of paid Facebook/Instagram ads for private and Christian school clients. The platform scans client websites, generates ad copy with AI, provides a preview/approval workflow, and publishes directly to Meta Ads Manager.

**Users:** Tassel Marketing team only (no client-facing features in V1).
**Ad type:** Paid ads only (Meta Marketing API), no organic posts.

---

## Tech Stack

- **Monorepo:** npm workspaces
- **Backend:** Node.js, Express, TypeScript
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **AI:** Claude API (Anthropic) for content generation
- **Scanner:** Playwright (headless browser)
- **Job Queue:** BullMQ (Redis-backed)
- **File Storage:** AWS S3 (MinIO locally)
- **Auth:** JWT (internal team only)
- **Testing:** Vitest, Supertest, React Testing Library

---

## Project Structure

```
tassel-ad-platform/
├── CLAUDE.md              ← You are here
├── packages/
│   ├── api/               ← Backend API (Express + Prisma)
│   ├── web/               ← Frontend (Next.js)
│   ├── scanner/           ← Website scanning module
│   └── content-engine/    ← AI content generation
├── shared/                ← Shared types and utilities
└── docs/                  ← PRD, architecture docs
```

---

## Coding Conventions (ALWAYS FOLLOW)

- TypeScript strict mode in all packages
- ESLint + Prettier enforced
- Files: kebab-case (school-profile.ts)
- Components: PascalCase (AdPreview)
- Functions/variables: camelCase (generateAdCopy)
- Database tables: snake_case (ad_drafts)
- API routes: kebab-case (/api/ad-drafts)
- All API responses: `{ success: boolean, data?: T, error?: string }`
- Async/await everywhere (no raw promises)
- Functional React components only
- Commit messages: conventional commits (feat:, fix:, refactor:, test:, docs:)

---

## Key Design Decisions

1. **Modular architecture:** Each package (scanner, content-engine, api, web) is independent. Changes in one should not require changes in another. Communicate through the API.

2. **Background jobs for slow operations:** Website scanning and Meta publishing run as BullMQ jobs, not synchronous API calls. The frontend polls for job status.

3. **AI prompts are versioned files:** Prompt templates live in `packages/content-engine/src/prompts/` as `.ts` files. Each generated ad stores the prompt version used. Never hardcode prompts in business logic.

4. **School profiles are editable:** The scanner produces a first draft, but team members can always manually edit any extracted data before it's used for content generation.

5. **Meta API abstraction layer:** All Meta Marketing API calls go through a single service class in `packages/api/src/lib/meta-client.ts`. Never call the Meta API directly from routes or other services.

---

## Module Status

| Module | Status | Notes |
|--------|--------|-------|
| Project scaffolding | In progress | Monorepo setup, shared types, dev scripts |
| Database schema | Not started | Prisma schema, migrations |
| Scanner | Not started | Playwright crawler + parser |
| Content Engine | Not started | Claude API integration + prompt templates |
| API | Not started | Express routes, services, middleware |
| Web - Dashboard | Not started | Client list, ad queue, stats |
| Web - Ad Previews | Not started | FB/IG preview components |
| Web - Approval Flow | Not started | Review, edit, upload, approve/reject |
| Meta Publisher | Not started | Marketing API integration |
| Auth | Not started | JWT login for team |

---

## Build Order (Recommended)

1. **Project scaffolding** — Monorepo, TypeScript configs, shared types, dev scripts, linting
2. **Database schema** — Prisma schema for all tables, initial migration, seed data
3. **Scanner module** — Crawl a real school website, output a School Profile JSON, write tests
4. **Content Engine** — Take a School Profile + campaign brief, generate ads via Claude API, write tests
5. **API core** — Express app, database routes for clients/campaigns/ads, file upload
6. **Web - Dashboard & Forms** — Client management, campaign brief form, ad listing
7. **Web - Ad Previews** — Facebook and Instagram ad preview components
8. **Web - Approval Flow** — Full review/edit/upload/approve workflow
9. **Meta Publisher** — OAuth connection, campaign/adset/ad creation, status polling
10. **Auth & Polish** — JWT auth, error handling, loading states, edge cases

---

## Common Commands

```bash
# Install all dependencies
npm install

# Start development (all packages)
npm run dev

# Start individual packages
npm run dev --workspace=packages/api
npm run dev --workspace=packages/web

# Run tests
npm test
npm test --workspace=packages/scanner

# Database
npx prisma migrate dev --schema=packages/api/prisma/schema.prisma
npx prisma studio --schema=packages/api/prisma/schema.prisma

# Lint
npm run lint
```

---

## Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tassel_ads

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Meta API
META_APP_ID=...
META_APP_SECRET=...

# File Storage
S3_BUCKET=tassel-ad-media
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=...

# App
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## Important Context for Claude Code

- **This is a marketing tool for schools.** Ad copy should never be generated with placeholder or lorem ipsum text in production. Tests can use fixture data.
- **Meta API has strict rate limits.** Always implement retry logic with exponential backoff. Never make unbounded parallel API calls.
- **Meta reviews all ads.** After publishing, ads enter a "pending review" state. The platform must poll for review status and surface rejections.
- **School websites vary wildly.** The scanner must be robust against missing data, unusual structures, and JS-heavy sites. Always validate and sanitize extracted data.
- **Prompt engineering matters.** When modifying prompts in the content engine, always test with at least 3 different school profiles to check for quality and consistency.

---

## Reference Documents

See /docs/ for:
- Product Requirements Document (PRD)
- Data Flow & System Architecture
- Technical Decisions Document
