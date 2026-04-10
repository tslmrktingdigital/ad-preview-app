import express from 'express';
import { clientsRouter } from './routes/clients.js';
import { campaignsRouter } from './routes/campaigns.js';
import { adsRouter } from './routes/ads.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/ads', adsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export { app };
