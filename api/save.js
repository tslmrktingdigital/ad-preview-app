import { put, list } from '@vercel/blob';

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const state = req.body;
    if (!state || typeof state !== 'object') {
      res.status(400).json({ error: 'Invalid body' });
      return;
    }

    const id = randomId();
    const pathname = `previews/${id}.json`;

    await put(pathname, JSON.stringify(state), {
      access: 'public',
      contentType: 'application/json',
    });

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (req.headers.origin || req.headers.referer || '').replace(/\/$/, '');
    const viewUrl = `${baseUrl}/view/${id}`;

    res.status(200).json({ id, url: viewUrl });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save preview' });
  }
}
