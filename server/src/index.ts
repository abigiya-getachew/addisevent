import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { requireAuth } from './middleware/auth.middleware.js';
import { eventsRoutes } from './modules/events/events.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app = new Hono();

app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('*', prettyJSON());

// Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'AddisEvent API',
    timestamp: new Date().toISOString(),
  });
});

// Auth
app.route('/api/v1/auth', authRoutes);

// Public events — no auth needed
app.route('/api/events', eventsRoutes);

// Protected base
const protectedApi = new Hono();
protectedApi.use('*', requireAuth);
app.route('/api/protected', protectedApi);

serve({ fetch: app.fetch, port: 5000 }, () => {
  console.log(' AddisEvent Backend running');
  console.log(' Health: http://localhost:5000/api/health');
  console.log(' Events: http://localhost:5000/api/events');
});