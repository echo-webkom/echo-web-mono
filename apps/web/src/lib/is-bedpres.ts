import { type fetchHomeHappenings } from "@/sanity/happening/requests";

/**
 * Type guard for checking if a happening is a bedpres.
 *
 * @note Asserts that the happening is a bedpres.
 *
 * @param happening The happening to check.
 * @returns true if the happening is a bedpres, false otherwise.
 */
export const isBedpres = (
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number],
): happening is Awaited<ReturnType<typeof fetchHomeHappenings<"bedpres">>>[number] => {
  return happening.happeningType === "bedpres";
};
