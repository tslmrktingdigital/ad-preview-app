import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { clientsRouter } from './routes/clients.js';
import { campaignsRouter } from './routes/campaigns.js';
import { adsRouter } from './routes/ads.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/error-handler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Boot background workers (imports register the Worker instances with BullMQ)
import './jobs/scan-job.js';
import './jobs/generate-job.js';
import './jobs/publish-job.js';
import './jobs/video-job.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json({ limit: '10mb' }));

// Serve generated videos (and any other uploads)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/ads', adsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\nTassel API running on http://localhost:${PORT}`);
  console.log(`Workers: scan, generate, publish, video\n`);
});

export { app };
