import { describe, expect, it } from "vitest";

import {
  calendarEventDayLabel,
  calendarMultiDayLayout,
  groupCalendarEvents,
  occursOnCalendarDay,
} from "../calendar-event-display";
import { type CalendarEvent } from "../calendar-event-helpers";

const event = (date: string, endDate?: string, id = "event"): CalendarEvent => ({
  id,
  title: id,
  date: new Date(date),
  endDate: endDate ? new Date(endDate) : undefined,
  body: "",
  link: "/arrangement/test",
  type: "event",
});

describe("calendar event display", () => {
  const overnight = event("2026-10-07T18:00:00+02:00", "2026-10-08T02:00:00+02:00");

  it("shows an overnight event on both dates, independent of the cell's time", () => {
    expect(occursOnCalendarDay(overnight, new Date(2026, 9, 7, 0))).toBe(true);
    expect(occursOnCalendarDay(overnight, new Date(2026, 9, 8, 18))).toBe(true);
    expect(occursOnCalendarDay(overnight, new Date(2026, 9, 9))).toBe(false);
  });

  it("does not present the original start time as a new start on the next day", () => {
    expect(calendarEventDayLabel(overnight, new Date(2026, 9, 7))).toBe("Starter 18:00");
    expect(calendarEventDayLabel(overnight, new Date(2026, 9, 8))).toBe(
      "Fortsetter · slutter 02:00",
    );
  });

  it("keeps both days of an overnight event in the connected multi-day section", () => {
    expect(groupCalendarEvents([overnight], new Date(2026, 9, 7)).multiDay).toEqual([overnight]);
    expect(groupCalendarEvents([overnight], new Date(2026, 9, 8)).multiDay).toEqual([overnight]);
  });

  it("keeps ordinary events separate from overlapping month-long events", () => {
    const movember = event("2026-11-01T00:00:00+01:00", "2026-12-01T00:00:00+01:00", "movember");
    const challenge = event("2026-10-20T18:00:00+02:00", "2026-11-20T18:00:00+01:00", "challenge");
    const lunch = event("2026-11-10T12:00:00+01:00", undefined, "lunch");
    const evening = event("2026-11-10T18:00:00+01:00", undefined, "evening");
    const grouped = groupCalendarEvents(
      [movember, evening, challenge, lunch],
      new Date(2026, 10, 10),
    );
    expect(grouped.daily).toEqual([lunch, evening]);
    expect(grouped.multiDay).toEqual([challenge, movember]);
    expect(calendarEventDayLabel(movember, new Date(2026, 10, 10))).toBe("Fortsetter");
  });

  it("does not reserve multi-day rows on Monday when the trip starts Wednesday", () => {
    const trip = event("2026-10-07T18:00:00+02:00", "2026-10-09T18:00:00+02:00");
    const days = Array.from({ length: 7 }, (_, i) => new Date(2026, 9, 5 + i));
    expect(calendarMultiDayLayout([trip], days).occupiedRows).toEqual([0, 0, 1, 1, 1, 0, 0]);
  });

  it("treats midnight as an exclusive end", () => {
    const midnight = event("2026-10-07T18:00:00+02:00", "2026-10-08T00:00:00+02:00");
    expect(occursOnCalendarDay(midnight, new Date(2026, 9, 7))).toBe(true);
    expect(occursOnCalendarDay(midnight, new Date(2026, 9, 8))).toBe(false);
  });

  it("uses Oslo dates around UTC midnight and the daylight saving transition", () => {
    const lateNight = event("2026-10-24T22:30:00Z", "2026-10-25T02:30:00Z");
    expect(occursOnCalendarDay(lateNight, new Date(2026, 9, 24))).toBe(false);
    expect(occursOnCalendarDay(lateNight, new Date(2026, 9, 25))).toBe(true);
    expect(calendarEventDayLabel(lateNight, new Date(2026, 9, 25))).toBe("00:30–03:30");
  });

  it("retains first days when continuations are hidden", () => {
    const trip = event("2026-10-07T18:00:00+02:00", "2026-10-09T18:00:00+02:00");
    expect(groupCalendarEvents([trip], new Date(2026, 9, 7), false).multiDay).toEqual([trip]);
    expect(groupCalendarEvents([trip], new Date(2026, 9, 8), false).multiDay).toEqual([]);
  });

  it("treats missing or invalid end dates as a single start date", () => {
    for (const end of [undefined, "invalid", "2026-10-06T18:00:00+02:00"]) {
      const single = event("2026-10-07T18:00:00+02:00", end);
      expect(occursOnCalendarDay(single, new Date(2026, 9, 7))).toBe(true);
      expect(occursOnCalendarDay(single, new Date(2026, 9, 8))).toBe(false);
      expect(calendarEventDayLabel(single, new Date(2026, 9, 7))).toBe("18:00");
    }
  });
});
