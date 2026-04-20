import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

// ── Mock all external dependencies before importing app ──────────────────────

vi.mock('../src/lib/prisma.js', () => ({
  prisma: {
    client: {
      create: vi.fn().mockResolvedValue({ id: 'c1', name: 'Eastern Christian', websiteUrl: 'https://example.com', createdAt: new Date() }),
      findMany: vi.fn().mockResolvedValue([]),
      findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'c1', name: 'Eastern Christian', websiteUrl: 'https://example.com', schoolProfile: null, campaigns: [] }),
    },
    campaign: {
      create: vi.fn().mockResolvedValue({ id: 'camp1', name: 'Spring Open House', goal: 'open_house', clientId: 'c1', createdAt: new Date() }),
      findMany: vi.fn().mockResolvedValue([]),
      findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'camp1', name: 'Spring Open House', goal: 'open_house', clientId: 'c1', client: { schoolProfile: { profileData: { name: 'EC', gradeLevels: [], programs: [], testimonials: [], upcomingEvents: [], accreditations: [], awards: [], location: {} } } }, adDrafts: [] }),
    },
    adDraft: {
      findMany: vi.fn().mockResolvedValue([]),
      findUniqueOrThrow: vi.fn().mockResolvedValue({ id: 'ad1', status: 'draft', headline: 'Test Ad', primaryText: 'Test copy', cta: 'SIGN_UP', imageBrief: 'test', hashtags: [], campaignId: 'camp1' }),
      update: vi.fn().mockResolvedValue({ id: 'ad1', status: 'approved' }),
    },
    publishingLog: {
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'log1' }),
    },
    schoolProfile: {
      upsert: vi.fn().mockResolvedValue({ clientId: 'c1', scanStatus: 'complete' }),
    },
  },
}));

vi.mock('../src/lib/redis.js', () => ({
  redis: { on: vi.fn() },
}));

vi.mock('../src/jobs/scan-job.js', () => ({
  scanQueue: { add: vi.fn().mockResolvedValue({ id: 'job-scan-1' }), getJobs: vi.fn().mockResolvedValue([]) },
  scanWorker: { on: vi.fn() },
}));

vi.mock('../src/jobs/generate-job.js', () => ({
  generateQueue: { add: vi.fn().mockResolvedValue({ id: 'job-gen-1' }), getJobs: vi.fn().mockResolvedValue([]) },
  generateWorker: { on: vi.fn() },
}));

vi.mock('../src/jobs/publish-job.js', () => ({
  publishQueue: { add: vi.fn().mockResolvedValue({ id: 'job-pub-1' }) },
  publishWorker: { on: vi.fn() },
}));

import { app } from '../src/index.js';

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('POST /api/clients', () => {
  it('creates a client with valid body', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ name: 'Eastern Christian', websiteUrl: 'https://www.easternchristian.org' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Eastern Christian');
  });

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ websiteUrl: 'https://example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid URL', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ name: 'Test', websiteUrl: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/clients', () => {
  it('returns array', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('POST /api/clients/:id/scan', () => {
  it('enqueues a scan job and returns jobId', async () => {
    const res = await request(app).post('/api/clients/c1/scan');
    expect(res.status).toBe(200);
    expect(res.body.data.jobId).toBe('job-scan-1');
  });
});

describe('POST /api/campaigns', () => {
  it('creates a campaign with valid body', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .send({ clientId: 'clxxxxxxxxxxxxxxxx', name: 'Spring Open House', goal: 'open_house', season: 'open_house' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('rejects invalid goal', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .send({ clientId: 'clxxxxxxxxxxxxxxxx', name: 'Test', goal: 'bad_goal', season: 'general' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/campaigns/:id/generate', () => {
  it('enqueues a generation job', async () => {
    const res = await request(app).post('/api/campaigns/camp1/generate');
    expect(res.status).toBe(200);
    expect(res.body.data.jobId).toBe('job-gen-1');
  });
});

describe('POST /api/ads/:id/approve', () => {
  it('approves a draft ad', async () => {
    const res = await request(app).post('/api/ads/ad1/approve');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/ads/:id/reject', () => {
  it('rejects with a reason', async () => {
    const res = await request(app)
      .post('/api/ads/ad1/reject')
      .send({ reason: 'Copy too generic' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('requires a reason', async () => {
    const res = await request(app)
      .post('/api/ads/ad1/reject')
      .send({});
    expect(res.status).toBe(400);
  });
});
