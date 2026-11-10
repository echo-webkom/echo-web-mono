"use client";

import Link from "next/link";

import {
  calendarEventEnd,
  isMultiDayEvent,
  startsOnCalendarDay,
} from "@/lib/calendar-event-display";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { shortDate, time } from "@/utils/date";
import { ellipsis } from "@/utils/string";

type Props = {
  event: CalendarEvent;
  day?: Date;
};

export const EventHoverPreview = ({ event, day }: Props) => {
  const end = calendarEventEnd(event);
  const multiDay = isMultiDayEvent(event);
  return (
    <div className="space-y-2">
      <div>
        <Link className="hover:underline" href={event.link}>
          <h3 className="font-semibold break-words">{event.title}</h3>
        </Link>
        {multiDay && end ? (
          <div className="space-y-1 text-sm">
            {day && !startsOnCalendarDay(event, day) && (
              <p className="text-muted-foreground">Fortsettelse av samme arrangement</p>
            )}
            <p>Fra {shortDate(event.date)}</p>
            <p>Til {shortDate(end)}</p>
          </div>
        ) : (
          <p className="text-sm">
            {shortDate(event.date)}
            {end ? `–${time(end)}` : ""}
          </p>
        )}
      </div>
      <p className="text-sm font-medium">{ellipsis(event.body, 250)}</p>
      <div>
        <Link href={event.link} className="text-sm font-medium italic hover:underline">
          Les mer
        </Link>
      </div>
    </div>
  );
};
