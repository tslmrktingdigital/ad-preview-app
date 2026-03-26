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
    // Narrow prefix so we don't rely on paginated list of all previews/
    const result = await list({ prefix: `previews/${id}`, limit: 10 });
    const blobs = Array.isArray(result) ? result : (result.blobs || []);
    const blob = blobs.find((b) => b.pathname === pathname);

    if (!blob || !blob.url) {
      res.status(404).json({ error: 'Preview not found' });
      return;
    }

    const resp = await fetch(blob.url);
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
