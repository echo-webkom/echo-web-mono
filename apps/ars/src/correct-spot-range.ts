import { type SpotRange } from "@echo-webkom/db/schemas";

export const getCorrectSpotrange = (
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
