import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  try {
    const pathname = `previews/${id}.json`;
    const result = await list({ prefix: 'previews/' });
    const blobs = Array.isArray(result) ? result : (result.blobs || result);
    const blob = blobs.find((b) => b.pathname === pathname);

    if (!blob || !blob.url) {
      res.status(404).json({ error: 'Preview not found' });
      return;
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const resp = await fetch(blob.url, { headers });
    if (!resp.ok) {
      res.status(404).json({ error: 'Preview not found' });
      return;
    }

    const state = await resp.json();
    res.status(200).json(state);
  } catch (err) {
    console.error('View error:', err);
    res.status(500).json({ error: 'Failed to load preview' });
  }
}
