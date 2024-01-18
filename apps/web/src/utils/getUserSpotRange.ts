import { type SpotRange } from "@echo-webkom/db/schemas";

/**
 * Get correct spot range for user
 *
 * If user is not in any spot range, return null
 */

export function getUserSpotRange(
  year: number,
  spotRanges: Array<SpotRange>,
  canSkipSpotRange: boolean,
) {
  return (
    spotRanges.find((spotRange) => {
      if (canSkipSpotRange) {
        return true;
      }

      return year >= spotRange.minYear && year <= spotRange.maxYear;
    }) ?? null
  );
}
