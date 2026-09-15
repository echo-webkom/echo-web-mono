import { formatInTimeZone } from "date-fns-tz";

import { time } from "@/utils/date";

import { type CalendarEvent } from "./calendar-event-helpers";

const OSLO_TIME_ZONE = "Europe/Oslo";
const eventDay = (date: Date) => formatInTimeZone(date, OSLO_TIME_ZONE, "yyyy-MM-dd");

// Calendar cells represent calendar dates, regardless of the time on the Date object.
const cellDay = (day: Date) =>
  `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

export const calendarEventEnd = (event: CalendarEvent) =>
  event.endDate && event.endDate > event.date ? event.endDate : undefined;

export const isMultiDayEvent = (event: CalendarEvent) => {
  const end = calendarEventEnd(event);
  return !!end && eventDay(event.date) !== eventDay(end);
};

export const startsOnCalendarDay = (event: CalendarEvent, day: Date) =>
  eventDay(event.date) === cellDay(day);

export const occursOnCalendarDay = (event: CalendarEvent, day: Date) => {
  const startDay = eventDay(event.date);
  const end = calendarEventEnd(event);
  // An event ending at midnight does not occupy the following day.
  const lastDay = end ? eventDay(new Date(end.getTime() - 1)) : startDay;
  return startDay <= cellDay(day) && cellDay(day) <= lastDay;
};

export const calendarEventDayLabel = (event: CalendarEvent, day: Date) => {
  const end = calendarEventEnd(event);
  if (!isMultiDayEvent(event)) {
    return end ? `${time(event.date)}–${time(end)}` : time(event.date);
  }
  if (startsOnCalendarDay(event, day)) return `Starter ${time(event.date)}`;
  if (end && eventDay(end) === cellDay(day)) return `Fortsetter · slutter ${time(end)}`;
  return "Fortsetter";
};

export const groupCalendarEvents = (
  events: Array<CalendarEvent>,
  day: Date,
  showLongEvents = true,
) => {
  const daily: Array<CalendarEvent> = [];
  const multiDay: Array<CalendarEvent> = [];

  for (const event of events) {
    if (!occursOnCalendarDay(event, day)) continue;
    const startsToday = startsOnCalendarDay(event, day);
    if (!showLongEvents && !startsToday) continue;

    (isMultiDayEvent(event) ? multiDay : daily).push(event);
  }

  const byStart = (a: CalendarEvent, b: CalendarEvent) => a.date.getTime() - b.date.getTime();
  return { daily: daily.sort(byStart), multiDay: multiDay.sort(byStart) };
};

// Shared lanes keep a multi-day event aligned without reserving space on unrelated days.
export const calendarMultiDayLayout = (
  events: Array<CalendarEvent>,
  days: Array<Date>,
  showLongEvents = true,
) => {
  const eventsByDay = days.map((day) => groupCalendarEvents(events, day, showLongEvents).multiDay);
  const visibleEvents = [...new Set(eventsByDay.flat())].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  const occupiedRows = eventsByDay.map((dayEvents) =>
    visibleEvents.reduce((last, event, index) => (dayEvents.includes(event) ? index + 1 : last), 0),
  );
  return { eventsByDay, visibleEvents, occupiedRows };
};

export const calendarMultiDayHeight = (compact: boolean) => (compact ? 24 : 32);
