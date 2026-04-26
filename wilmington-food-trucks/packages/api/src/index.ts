import express from 'express';
import cors from 'cors';
import { trucksRouter } from './routes/trucks.js';
import { scheduleRouter } from './routes/schedule.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/trucks', trucksRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/admin', adminRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`WFT API running on port ${PORT}`);
});
