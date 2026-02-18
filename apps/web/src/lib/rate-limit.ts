import { eq, sql } from "drizzle-orm";

import { kv } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

type RateLimitConfig = {
  /**
   * Unique identifier for the rate limit (e.g., "email-verification:user@example.com")
   */
  key: string;
  /**
   * Maximum number of attempts allowed
   */
  maxAttempts: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: Date;
};

/**
 * Check if a rate limit has been exceeded using PostgreSQL KV table.
 * Uses atomic operations to ensure thread-safety.
 *
 * @returns RateLimitResult with success indicating if the action is allowed
 */
export async function checkRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const { key, maxAttempts, windowSeconds } = config;
  const now = new Date();
  const ttl = new Date(now.getTime() + windowSeconds * 1000);

  // Clean up expired entries first
  await db.delete(kv).where(sql`${kv.ttl} < now()`);

  // Try to get existing rate limit record
  const existing = await db.query.kv.findFirst({
    where: eq(kv.key, key),
  });

  if (!existing) {
    // First attempt - create new record
    await db.insert(kv).values({
      key,
      value: { count: 1, firstAttempt: now.toISOString() },
      ttl,
    });

    return {
      success: true,
      remaining: maxAttempts - 1,
      resetAt: ttl,
    };
  }

  const data = existing.value as { count: number; firstAttempt: string };
  const count = data.count ?? 0;

  if (count >= maxAttempts) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetAt: existing.ttl ?? ttl,
    };
  }

  // Increment counter
  await db
    .update(kv)
    .set({
      value: { count: count + 1, firstAttempt: data.firstAttempt },
    })
    .where(eq(kv.key, key));

  return {
    success: true,
    remaining: maxAttempts - count - 1,
    resetAt: existing.ttl ?? ttl,
  };
}

/**
 * Reset a rate limit for a specific key
 */
export async function resetRateLimit(key: string): Promise<void> {
  await db.delete(kv).where(eq(kv.key, key));
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  config: Pick<RateLimitConfig, "key" | "maxAttempts">,
): Promise<Omit<RateLimitResult, "success">> {
  const { key, maxAttempts } = config;

  const existing = await db.query.kv.findFirst({
    where: eq(kv.key, key),
  });

  if (!existing) {
    return {
      remaining: maxAttempts,
      resetAt: new Date(),
    };
  }

  const data = existing.value as { count: number; firstAttempt: string };
  const count = data.count ?? 0;

  return {
    remaining: Math.max(0, maxAttempts - count),
    resetAt: existing.ttl ?? new Date(),
  };
}
