import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { checkPostgres } from './lib/pg.js';
import { checkQdrant } from './lib/qdrant.js';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

await app.register(swagger, {
  openapi: { info: { title: 'Endolib API', version: '0.1.0' } }
});

await app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: { docExpansion: 'list', deepLinking: false }
});

await app.register(cors, { origin: true });

// Liveness
app.get('/v1/healthz', async () => ({
  ok: true,
  service: 'endolib-api',
  time: new Date().toISOString()
}));

// Readiness (checks Postgres + Qdrant)
app.get('/v1/readyz', async () => {
  const Env = z.object({
    DATABASE_URL: z.string().url(),
    QDRANT_URL: z.string().url()
  }).safeParse(process.env);

  if (!Env.success) {
    return { ok: false, error: 'Missing env', details: Env.error.flatten() };
  }

  const { DATABASE_URL, QDRANT_URL } = Env.data;

  const [pgOk, qdrantOk] = await Promise.allSettled([
    checkPostgres(DATABASE_URL),
    checkQdrant(QDRANT_URL)
  ]);

  const postgres = pgOk.status === 'fulfilled' && pgOk.value === true;
  const qdrant = qdrantOk.status === 'fulfilled' && qdrantOk.value === true;

  return {
    ok: postgres && qdrant,
    postgres,
    qdrant,
    time: new Date().toISOString()
  };
});

const port = Number(process.env.PORT ?? 3000);
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`API listening at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
