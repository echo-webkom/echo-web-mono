"use client";

import Link from "next/link";

import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { time } from "@/utils/date";
import { ellipsis } from "@/utils/string";

type Props = {
  event: CalendarEvent;
};

export const EventHoverPreview = ({ event }: Props) => {
  return (
    <div className="space-y-2">
      <div>
        <Link className="hover:underline" href={event.link}>
          <h3 className="line-clamp-1 font-semibold text-ellipsis">{event.title}</h3>
        </Link>
        <h3 className="text-sm">{time(event.date)}</h3>
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
