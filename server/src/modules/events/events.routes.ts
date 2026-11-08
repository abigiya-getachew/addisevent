import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { requireAuth, requireRole } from '../../middleware/auth.middleware.js';
import {
  getPublishedEvents,
  getOrganizerEvents,
  getEventById,
  createEvent,
  updateEvent,
} from './events.service.js';
import { CreateEventSchema } from './events.schema.js';

const eventsRoutes = new Hono();

// ========== PUBLIC ROUTES — Anyone can view ==========
eventsRoutes.get('/', async (c) => {
  const events = await getPublishedEvents();
  return c.json({ data: events });
});

eventsRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const event = await getEventById(id);
  
  if (!event) return c.json({ error: 'Event not found' }, 404);
  return c.json({ data: event });
});

// ========== PROTECTED — Must be logged in ==========
eventsRoutes.use('*', requireAuth);

// Organizer: See their own events
eventsRoutes.get('/my/organizer', requireRole('organizer', 'admin'), async (c) => {
  const user = c.get('user');
  const myEvents = await getOrganizerEvents(user.id);
  return c.json({ data: myEvents });
});

// Organizer: Create new event
eventsRoutes.post(
  '/',
  requireRole('organizer', 'admin'),
  zValidator('json', CreateEventSchema),
  async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    
    const newEvent = await createEvent(user.id, data);
    return c.json({ data: newEvent }, 201);
  }
);

// Organizer: Update event
eventsRoutes.patch(
  '/:id',
  requireRole('organizer', 'admin'),
  zValidator('json', CreateEventSchema.partial()),
  async (c) => {
    const user = c.get('user');
    const eventId = c.req.param('id');
    const data = c.req.valid('json');
    
    const updated = await updateEvent(eventId, user.id, data);
    if (!updated) return c.json({ error: 'Not found or not yours' }, 404);
    
    return c.json({ data: updated });
  }
);

export { eventsRoutes };