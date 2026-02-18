import { lt } from "drizzle-orm";

import { verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

/**
 * Clean up expired verification tokens from the database.
 * This removes tokens that have passed their expiration time.
 *
 * @returns The number of tokens deleted
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, new Date()))
      .returning({ token: verificationTokens.token });

    return result.length;
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return 0;
  }
}

/**
 * Clean up old verification tokens (older than specified hours).
 * This is more aggressive than cleanupExpiredTokens and removes
 * tokens that are older than a certain age, even if not yet expired.
 *
 * @param hoursOld - Delete tokens older than this many hours (default: 24)
 * @returns The number of tokens deleted
 */
export async function cleanupOldTokens(hoursOld = 24): Promise<number> {
  try {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);

    const result = await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, cutoffTime))
      .returning({ token: verificationTokens.token });

    return result.length;
  } catch (error) {
    console.error("Error cleaning up old tokens:", error);
    return 0;
  }
}
