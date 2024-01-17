import { isFuture, isPast } from "date-fns";

import { capitalize } from "./string";

export function norwegianDateString(date: Date | string) {
  const d = new Date(date);

  return capitalize(
    d.toLocaleDateString("nb-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Oslo",
    }),
  );
}

export function shortDate(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleTimeString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}

export function shortDateNoTime(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Oslo",
  });
}

export function shortDateNoYear(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}

export function shortDateNoTimeNoYear(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Oslo",
  });
}

export function time(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleTimeString("nb-NO", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}

/**
 *
 * @param date date to convert
 * @returns the date if it is valid, otherwise null
 */
export function toDateOrNull(date: string | Date | null) {
  if (!date) return null;

  const d = new Date(date);

  if (isNaN(d.getTime())) return null;

  return d;
}

/**
 *
 * @param startDate earliest date
 * @param endDate latest date
 * @returns if the current date is between the two dates
 */
export function isBetween(startDate: Date, endDate: Date): boolean {
  return isPast(startDate) && isFuture(endDate);
}
