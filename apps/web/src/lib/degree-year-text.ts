import { type JobAdsQueryResult } from "@echo-webkom/cms/types";

const YEARS: Record<string, number> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
  FIFTH: 5,
  PHD: 6,
};

export const degreeYearsToList = (degreeYears: JobAdsQueryResult[number]["degreeYears"]) => {
  const list: Array<number> = [];

  for (const [key, value] of Object.entries(degreeYears ?? {})) {
    if (value === true) {
      const year = YEARS[key];
      if (typeof year === "number") {
        list.push(year);
      }
    }
  }

  return list.sort((a, b) => a - b);
};

/**
 * Convert an array of degree years to a human-readable string.
 *
 * @example
 * ```ts
 * degreeYearText([1, 2, 3, 4, 5, 6]); // "Alle"
 * degreeYearText([1, 2, 3, 5]); // "1 - 3 og 5. trinn"
 * ```
 *
 * @param degreeYears an array of degree years
 * @returns a string representation of the degree years
 */
export const degreeYearText = (degreeYears: Array<number>): string => {
  if (degreeYears.length === 0) {
    return "Ingen";
  }
  if (degreeYears.length === 6) {
    return "Alle";
  }

  const first = degreeYears[0]!;

  if (degreeYears.length === 1) {
    return first.toString() + ". trinn";
  }

  let start = first;
  let curr = first;

  const seqs: Array<string> = [];

  for (const year of degreeYears.slice(1)) {
    if (year !== curr + 1) {
      if (start === curr) {
        seqs.push(start.toString());
      } else {
        seqs.push(`${start} - ${curr}`);
      }
      start = year;
    }
    curr = year;
  }

  if (start === curr) {
    seqs.push(start.toString());
  } else {
    seqs.push(`${start} - ${curr}`);
  }

  const last = seqs.pop()!;
  if (seqs.length === 0) {
    return last + ". trinn";
  }

  return `${seqs.join(", ")} og ${last}. trinn`;
};
