"use client";

import { groupCalendarEvents } from "@/lib/calendar-event-display";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

import { CalendarEventLink } from "./calendar-event-link";

type Props = {
  events: Array<CalendarEvent>;
  day: Date;
  showLongEvents?: boolean;
};

const EventItem = ({ event, day }: { event: CalendarEvent; day: Date }) => (
  <li>
    <CalendarEventLink
      event={event}
      day={day}
      className={cn(
        "hover:bg-muted focus-visible:ring-ring block min-w-0 border-l-4 p-2 focus-visible:ring-2",
        {
          "border-primary": event.type === "bedpres",
          "border-secondary": event.type === "event",
          "border-pink-400": event.type === "movie",
          "border-green-600": event.type === "boardgame",
          "border-gray-600": event.type === "other",
        },
      )}
    >
      <span className="line-clamp-2 text-sm font-semibold break-words">{event.title}</span>
    </CalendarEventLink>
  </li>
);

export const CalendarDayEvents = ({ events, day, showLongEvents = true }: Props) => {
  const { daily } = groupCalendarEvents(events, day, showLongEvents);
  return (
    <ul className="min-w-0 space-y-1 pb-2">
      {daily.map((event) => (
        <EventItem key={`${event.id}-${event.date.toISOString()}`} event={event} day={day} />
      ))}
    </ul>
  );
};
