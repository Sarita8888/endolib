import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

await app.register(cors, { origin: true });

app.get('/v1/healthz', async () => ({
  ok: true,
  service: 'endolib-api',
  time: new Date().toISOString()
}));

const port = Number(process.env.PORT ?? 3000);
const host = '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`API listening at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
