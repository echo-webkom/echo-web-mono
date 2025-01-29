import { SpotRange } from "@echo-webkom/db/schemas";

export const findCorrectSpotRange = (
  year: number,
  spotRanges: Array<SpotRange>,
  canSkipSpotRange: boolean,
) => {
  return (
    spotRanges.find((spotRange) => {
      if (canSkipSpotRange) {
        return true;
      }

      return year >= spotRange.minYear && year <= spotRange.maxYear;
    }) ?? null
  );
};
