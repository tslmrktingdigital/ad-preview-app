import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { MetaClient } from '../lib/meta-client.js';
import type { ApiResponse } from '@tassel/types';

export const authRouter = Router();

const META_SCOPES = 'ads_management,ads_read,pages_read_engagement,public_profile';

// GET /api/auth/meta/connect?clientId=xxx
// Redirects browser to Facebook OAuth dialog
authRouter.get('/meta/connect', (req, res) => {
  const clientId = req.query.clientId as string;
  if (!clientId) { res.status(400).json({ success: false, error: 'clientId required' }); return; }

  const appId = process.env.META_APP_ID;
  if (!appId) { res.status(500).json({ success: false, error: 'META_APP_ID not configured' }); return; }

  const redirectUri = process.env.META_REDIRECT_URI ?? `http://localhost:3001/api/auth/meta/callback`;
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: META_SCOPES,
    state: clientId,  // pass clientId through so the callback knows which client
    response_type: 'code',
  });

  res.redirect(`https://www.facebook.com/v20.0/dialog/oauth?${params}`);
});

// GET /api/auth/meta/callback?code=xxx&state=clientId
// Facebook redirects here after user approves permissions
authRouter.get('/meta/callback', async (req, res, next) => {
  try {
    const { code, state: clientId, error } = req.query as Record<string, string>;
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

    if (error) {
      res.redirect(`${frontendUrl}/clients/${clientId}?metaError=${encodeURIComponent(error)}`);
      return;
    }
    if (!code || !clientId) {
      res.status(400).json({ success: false, error: 'Missing code or state' } satisfies ApiResponse);
      return;
    }

    const redirectUri = process.env.META_REDIRECT_URI ?? 'http://localhost:3001/api/auth/meta/callback';

    // Exchange code → short-lived token → long-lived token (60 days)
    const shortToken = await MetaClient.exchangeCodeForToken(code, redirectUri);
    const longToken = await MetaClient.getLongLivedToken(shortToken);

    const meta = new MetaClient(longToken);

    // Fetch ad accounts + pages
    const [accountsResp, pagesResp] = await Promise.all([
      meta.getAdAccounts(),
      meta.getPages(),
    ]);

    const firstAccount = accountsResp.data?.[0];
    const firstPage = pagesResp.data?.[0];

    // Save token + account IDs to the client record
    await prisma.client.update({
      where: { id: clientId },
      data: {
        metaAccessToken: longToken,
        metaAccountId: firstAccount?.account_id ?? firstAccount?.id?.replace('act_', '') ?? null,
        metaPageId: firstPage?.id ?? null,
      },
    });

    res.redirect(`${frontendUrl}/clients/${clientId}?metaConnected=true`);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/meta/status?clientId=xxx — check if connected
authRouter.get('/meta/status', async (req, res, next) => {
  try {
    const clientId = req.query.clientId as string;
    if (!clientId) { res.status(400).json({ success: false, error: 'clientId required' }); return; }
    const client = await prisma.client.findUniqueOrThrow({
      where: { id: clientId },
      select: { metaAccountId: true, metaPageId: true, metaAccessToken: true },
    });
    res.json({
      success: true,
      data: {
        connected: !!client.metaAccessToken,
        adAccountId: client.metaAccountId,
        pageId: client.metaPageId,
      },
    } satisfies ApiResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login (placeholder)
authRouter.post('/login', async (_req, res) => {
  res.json({ success: true, data: { token: null } } satisfies ApiResponse);
});
