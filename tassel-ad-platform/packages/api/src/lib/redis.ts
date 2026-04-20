import IORedis from 'ioredis';

/**
 * Shared Redis connection for BullMQ.
 * BullMQ requires maxRetriesPerRequest: null on the connection.
 */
export const redis = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});
