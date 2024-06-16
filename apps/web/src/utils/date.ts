import {
  differenceInHours,
  format,
  isAfter,
  isBefore,
  isFuture,
  isPast,
  nextMonday,
  startOfDay,
} from "date-fns";
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

/** Converts a date to a short date string without time, together with an end-date if it exists */
export function shortDateNoTimeWithEndDate(date: Date | string, endDate?: Date | string) {
  const d = new Date(date);
  const e = new Date(endDate ?? "");
  if (endDate && !isSameDate(d, e)) return `${shortDateNoTime(d)} - ${shortDateNoTime(e)}`;

  return shortDateNoTime(d);
}

/**
 * Returns the start of the next week from the given date
 * @param date date to convert
 * @returns a new Date objet
 */
export function startOfNextWeek(date: Date | string) {
  return startOfDay(nextMonday(date));
}

/**
 * Returns the start of the week after next week from the given date
 * @param date date to convert
 * @returns a new Date objet
 */
export function startOfTheWeekAfterNext(date: Date | string) {
  return startOfDay(nextMonday(nextMonday(date)));
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

/** Converts a date to a time string together with an end-time if the end-date is the same as the start */
export function timeWithEndTime(date: Date | string, endDate?: Date | string) {
  const d = new Date(date);
  const e = new Date(endDate ?? "");
  if (isSameDate(d, e)) return `${time(d)} - ${time(e)}`;

  return time(d);
}

/**
 * Checks if two dates share the same year, month and day.
 * @param d1
 * @param d2
 * @returns true or false
 */
export function isSameDate(date1: Date | string, date2: Date | string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
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
 * Checks if a given date is between two dates
 * @param date the date to check
 * @param startDate earliest date
 * @param endDate endDate
 * @returns if the date is between the two dates
 */
export function dateIsBetween(date: Date, startDate: Date, endDate: Date): boolean {
  return isAfter(date, startDate) && isBefore(date, endDate);
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

export const _differenceInHours = (dateLeft: Date | null, dateRight: Date | null) => {
  if (!dateLeft || !dateRight) return 0;
  return differenceInHours(dateLeft, dateRight);
};
