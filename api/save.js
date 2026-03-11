import { put } from '@vercel/blob';

// Uses a public Blob store (e.g. "ad-preview-app-blob"). BLOB_READ_WRITE_TOKEN is read from env by the SDK; we do not pass token in options.

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getErrorMessage(err) {
  const msg = err?.message || '';
  if (msg.includes('BLOB_') || msg.includes('token') || msg.includes('credentials')) {
    return 'Blob storage not configured. In Vercel: Storage → Create → Blob, then redeploy.';
  }
  if (msg.includes('payload') || msg.includes('too large') || msg.includes('413')) {
    return 'Preview too large. Try smaller images or shorter videos (under ~2MB total).';
  }
  return 'Failed to save preview. Check Vercel Blob is enabled and redeploy.';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(500).json({
      error: 'Blob storage not set up. In Vercel: go to Storage → Create → Blob, then redeploy.',
    });
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
    const friendly = getErrorMessage(err);
    const raw = [
      err?.message,
      err?.code,
      err?.name,
      typeof err?.toString === 'function' ? err.toString() : '',
    ]
      .filter(Boolean)
      .join(' ');
    const detail = (raw || JSON.stringify(err)).slice(0, 400);
    res.status(500).json({
      error: friendly,
      detail: detail || 'Unknown error',
    });
  }
}
