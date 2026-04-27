import { verificationTokens } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { lt } from "drizzle-orm";

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
