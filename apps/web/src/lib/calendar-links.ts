export type CalendarEvent = {
  title: string;
  description?: string;
  start: Date;
  end?: Date;
};

const DEFAULT_EVENT_DURATION_MS = 2 * 60 * 60 * 1000;

const toUtcDateTime = (date: Date): string => {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
};

const normalizeText = (value?: string): string => {
  if (!value) {
    return "";
  }

  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
};

const getEndDate = (event: CalendarEvent): Date => {
  if (event.end) {
    return event.end;
  }

  return new Date(event.start.getTime() + DEFAULT_EVENT_DURATION_MS);
};

/**
 * Create a Google Calendar link for the given event.
 */
export const googleCalendarLink = (event: CalendarEvent): string => {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", event.title);
  url.searchParams.set("details", normalizeText(event.description));
  url.searchParams.set(
    "dates",
    `${toUtcDateTime(event.start)}/${toUtcDateTime(getEndDate(event))}`,
  );
  return url.toString();
};

/**
 * Create an Outlook Calendar link for the given event.
 */
export const outlookCalendarLink = (event: CalendarEvent): string => {
  const url = new URL("https://outlook.office.com/calendar/0/deeplink/compose");
  url.searchParams.set("path", "/calendar/action/compose");
  url.searchParams.set("rru", "addevent");
  url.searchParams.set("subject", event.title);
  url.searchParams.set("body", normalizeText(event.description));
  url.searchParams.set("startdt", event.start.toISOString());
  url.searchParams.set("enddt", getEndDate(event).toISOString());
  return url.toString();
};

const escapeIcsText = (value?: string): string => {
  return normalizeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
};

/**
 * Create an ICS calendar link for the given event.
 */
export const icsCalendarLink = (event: CalendarEvent): string => {
  const now = toUtcDateTime(new Date());
  const uid = `${event.start.getTime()}@echo.uib.no`;

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//echo.uib.no//Calendar Export//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toUtcDateTime(event.start)}`,
    `DTEND:${toUtcDateTime(getEndDate(event))}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
};
