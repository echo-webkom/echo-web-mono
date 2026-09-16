"use client";

import { addDays } from "date-fns";
import Link from "next/link";

import {
  calendarEventDayLabel,
  calendarMultiDayLayout,
  calendarMultiDayHeight,
  occursOnCalendarDay,
  startsOnCalendarDay,
} from "@/lib/calendar-event-display";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from "../ui/hover-card";
import { EventHoverPreview } from "./event-hover-prev";

type Props = {
  events: Array<CalendarEvent>;
  days: Array<Date>;
  showLongEvents?: boolean;
  compact?: boolean;
};

const colors = {
  event: "bg-secondary",
  bedpres: "bg-primary",
  movie: "bg-pink-400",
  boardgame: "bg-green-600",
  other: "bg-gray-600",
};

export const CalendarMultiDayEvents = ({
  events,
  days,
  showLongEvents = true,
  compact = false,
}: Props) => {
  const { eventsByDay, visibleEvents } = calendarMultiDayLayout(events, days, showLongEvents);
  if (visibleEvents.length === 0) return null;

  return (
    <div className="pointer-events-none space-y-1 py-1" aria-label="Flerdagersarrangementer">
      {visibleEvents.map((event) => (
        <div
          key={`${event.id}-${event.date.toISOString()}`}
          className="grid items-end"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        >
          {days.map((day, index) => {
            if (!eventsByDay[index]!.includes(event)) return null;
            const startsToday = startsOnCalendarDay(event, day);
            const firstVisible = !eventsByDay[index - 1]?.includes(event);
            const endsToday = !occursOnCalendarDay(event, addDays(day, 1));
            return (
              <HoverCard key={day.toISOString()} openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Link
                    href={event.link}
                    aria-label={`${event.title} – ${calendarEventDayLabel(event, day)}`}
                    className={cn(
                      "group focus-visible:ring-ring hover:bg-muted/70 pointer-events-auto relative flex min-w-0 items-center focus-visible:z-10 focus-visible:ring-2",
                      startsToday && "ml-2",
                      endsToday && "mr-2",
                    )}
                    style={{ gridColumn: index + 1, height: calendarMultiDayHeight(compact) }}
                  >
                    {firstVisible && (
                      <span
                        className={cn(
                          "block truncate font-semibold",
                          compact
                            ? "bg-background text-foreground relative z-10 mx-2 px-1 text-xs"
                            : "px-2 pb-2 text-sm",
                        )}
                      >
                        {event.title}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 h-2 group-hover:brightness-90",
                        colors[event.type],
                        compact ? "top-1/2 -translate-y-1/2" : "bottom-0",
                        startsToday && "rounded-l-full",
                        endsToday && "rounded-r-full",
                      )}
                    />
                  </Link>
                </HoverCardTrigger>
                <HoverCardPortal>
                  <HoverCardContent>
                    <EventHoverPreview event={event} day={day} />
                  </HoverCardContent>
                </HoverCardPortal>
              </HoverCard>
            );
          })}
        </div>
      ))}
    </div>
  );
};
