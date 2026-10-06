import { Meilisearch } from "meilisearch";
import { eq } from "drizzle-orm";
import { db, schema } from "../../db/index.js";

function getClient() {
  const host = process.env.MEILISEARCH_HOST ?? process.env.MEILISEARCH_URL;
  const apiKey =
    process.env.MEILISEARCH_API_KEY ?? process.env.MEILISEARCH_MASTER_KEY;

  if (!host || !apiKey) {
    throw new Error(
      "MEILISEARCH_HOST and MEILISEARCH_API_KEY must be set to use search"
    );
  }

  return new Meilisearch({ host, apiKey });
}

export const EVENTS_INDEX = "events";

// ─── Index configuration ──────────────────────────────────────────────────────

export async function configureSearchIndex() {
  const client = getClient();
  const index = client.index(EVENTS_INDEX);

  await index.updateFilterableAttributes([
    "category",
    "city",
    "status",
    "isFree",
    "startAt",
    "organizerId",
  ]);

  await index.updateSortableAttributes(["startAt", "createdAt"]);

  await index.updateSearchableAttributes([
    "title",
    "titleAm",
    "description",
    "descriptionAm",
    "category",
    "venue",
    "city",
    "tags",
  ]);

  await index.updateRankingRules([
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
  ]);

  console.log("[Search] Index configured:", EVENTS_INDEX);
}

// ─── Sync a single event ──────────────────────────────────────────────────────

export async function indexEvent(eventId: string) {
  const client = getClient();
  const [event] = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.id, eventId))
    .limit(1);

  if (!event) return;

  // Only index published events
  if (event.status !== "published") {
    await removeEventFromIndex(eventId);
    return;
  }

  const doc = {
    id: event.id,
    title: event.title,
    titleAm: event.titleAm,
    description: event.description,
    descriptionAm: event.descriptionAm,
    category: event.category,
    venue: event.venue,
    city: event.city,
    startAt: event.startAt?.toISOString(),
    isFree: event.isFree,
    imageUrl: event.imageUrl,
    organizerId: event.organizerId,
    availableCapacity: event.availableCapacity,
    tags: event.tags ?? [],
    status: event.status,
    createdAt: event.createdAt?.toISOString(),
  };

  await client.index(EVENTS_INDEX).addDocuments([doc]);
}

// ─── Remove an event from index ───────────────────────────────────────────────

export async function removeEventFromIndex(eventId: string) {
  const client = getClient();
  await client.index(EVENTS_INDEX).deleteDocument(eventId);
}

// ─── Full re-sync ─────────────────────────────────────────────────────────────

export async function syncAllEvents() {
  const client = getClient();
  const events = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.status, "published"));

  if (events.length === 0) {
    console.log("[Search] No published events to sync");
    return;
  }

  const docs = events.map((e) => ({
    id: e.id,
    title: e.title,
    titleAm: e.titleAm,
    description: e.description,
    category: e.category,
    venue: e.venue,
    city: e.city,
    startAt: e.startAt?.toISOString(),
    isFree: e.isFree,
    imageUrl: e.imageUrl,
    organizerId: e.organizerId,
    availableCapacity: e.availableCapacity,
    tags: e.tags ?? [],
    status: e.status,
    createdAt: e.createdAt?.toISOString(),
  }));

  const task = await client.index(EVENTS_INDEX).addDocuments(docs);
  console.log(`[Search] Synced ${docs.length} events. Task uid: ${task.taskUid}`);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchEventsInput {
  q?: string;
  category?: string;
  city?: string;
  isFree?: boolean;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function searchEvents(input: SearchEventsInput) {
  const client = getClient();
  const {
    q = "",
    category,
    city,
    isFree,
    from,
    to,
    page = 1,
    limit = 20,
  } = input;

  const filters: string[] = ['status = "published"'];
  if (category) filters.push(`category = "${category}"`);
  if (city) filters.push(`city = "${city}"`);
  if (isFree !== undefined) filters.push(`isFree = ${isFree}`);
  if (from) filters.push(`startAt >= "${new Date(from).toISOString()}"`);
  if (to) filters.push(`startAt <= "${new Date(to).toISOString()}"`);

  const result = await client.index(EVENTS_INDEX).search(q, {
    filter: filters.join(" AND "),
    sort: ["startAt:asc"],
    hitsPerPage: limit,
    page,
    attributesToHighlight: ["title", "titleAm", "description"],
  });

  return {
    data: result.hits,
    pagination: {
      page: result.page,
      limit: result.hitsPerPage,
      total: result.totalHits,
      pages: result.totalPages,
    },
  };
}
