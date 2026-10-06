import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { ZodSchema, ZodError } from "zod";

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidateTarget = "json" | "query" | "param" | "form";

interface ValidationOptions<T> {
  schema: ZodSchema<T>;
  target?: ValidateTarget;
}

// Extend context variable map for validated data
declare module "hono" {
  interface ContextVariableMap {
    validatedBody: unknown;
    validatedQuery: unknown;
    validatedParam: unknown;
  }
}

// ─── Format Zod errors ────────────────────────────────────────────────────────

function formatZodError(err: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "_root";
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path]!.push(issue.message);
  }
  return fieldErrors;
}

// ─── Generic validator factory ────────────────────────────────────────────────

/**
 * Validates the request against a Zod schema.
 *
 * @example
 * // Validate JSON body
 * router.post("/", validate({ schema: CreateEventSchema }), handler)
 *
 * // Validate query params
 * router.get("/", validate({ schema: ListEventsSchema, target: "query" }), handler)
 */
export function validate<T>({
  schema,
  target = "json",
}: ValidationOptions<T>): MiddlewareHandler {
  return createMiddleware(async (c: Context, next: Next) => {
    let raw: unknown;

    try {
      switch (target) {
        case "json":
          raw = await c.req.json();
          break;
        case "query":
          raw = c.req.query();
          break;
        case "param":
          raw = c.req.param();
          break;
        case "form":
          raw = await c.req.formData().then((fd) =>
            Object.fromEntries(fd.entries())
          );
          break;
      }
    } catch {
      throw new HTTPException(400, { message: "Failed to parse request body" });
    }

    const result = schema.safeParse(raw);

    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          fields: formatZodError(result.error),
        },
        422
      );
    }

    // Store parsed data in context for the handler
    switch (target) {
      case "json":
        c.set("validatedBody", result.data);
        break;
      case "query":
        c.set("validatedQuery", result.data);
        break;
      case "param":
        c.set("validatedParam", result.data);
        break;
    }

    await next();
  });
}

/**
 * Shorthand helpers for common targets.
 */
export const validateBody = <T>(schema: ZodSchema<T>) =>
  validate({ schema, target: "json" });

export const validateQuery = <T>(schema: ZodSchema<T>) =>
  validate({ schema, target: "query" });

export const validateParam = <T>(schema: ZodSchema<T>) =>
  validate({ schema, target: "param" });
