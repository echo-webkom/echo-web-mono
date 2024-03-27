import { format, isFuture, isPast } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { capitalize } from "./string";

/**
 * Converts a date to a norwegian date string.
 *
 * @example
 * Example: "Onsdag 1. januar 2020 kl. 12:00"
 *
 * @param date date to convert
 * @returns the date in norwegian format
 */
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

/**
 * Converts a date to a short date string.
 *
 * @example
 * Example: "1. jan. 2020, 12:00"
 *
 * @param date date to convert
 * @returns the date in short format
 */
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

/**
 * Converts a date to a short date string without time.
 *
 * @example
 * Example: "1. jan. 2020"
 *
 * @param date date to convert
 * @returns the date in short format without time
 */
export function shortDateNoTime(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Oslo",
  });
}

/**
 * Converts a date to a short date string without time and year.
 *
 * @example
 * Example: "1. januar. 12:00"
 *
 * @param date date to convert
 * @returns the date in short format without time and year
 */
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

/**
 * Converts a date to a short date string without time and year.
 *
 * @example
 * Example: "1. jan."
 *
 * @param date date to convert
 * @returns short date without time and year
 */
export function shortDateNoTimeNoYear(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Oslo",
  });
}

/**
 * Converts a date to a time string.
 *
 * @example
 * Example: "12:00"
 *
 * @param date date to convert
 * @returns the time of the date
 */
export function time(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleTimeString("nb-NO", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}

/**
 * Converts a date to a date object or null if the date is invalid.
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
 * Checks if the current date is between two dates.
 *
 * @param startDate earliest date
 * @param endDate latest date
 * @returns if the current date is between the two dates
 */
export function isBetween(startDate: Date, endDate: Date): boolean {
  return isPast(startDate) && isFuture(endDate);
}

/**
 * Converts the day of the week to a string.
 *
 * Example: "Onsdag"
 *
 * @param date the date to convert
 * @returns the day of the week as a string
 */
export function dayStr(date: Date | string) {
  const d = new Date(date);

  return capitalize(
    format(d, "EEEE", {
      locale: nb,
    }),
  );
}

export function hoursBetween(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) return 0;
  return Math.abs(endDate.getTime() - startDate.getTime()) / 36e5;
}
