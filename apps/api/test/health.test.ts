import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';

describe('health endpoints', () => {
  it('/v1/healthz returns ok', async () => {
    const app = Fastify();
    app.get('/v1/healthz', async () => ({ ok: true }));
    const res = await app.inject({ method: 'GET', url: '/v1/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('ok', true);
  });
});
