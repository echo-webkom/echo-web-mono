"use client";

import Link from "next/link";
import { type ComponentProps } from "react";

import { type CalendarEvent } from "@/lib/calendar-event-helpers";

import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from "../ui/hover-card";
import { EventHoverPreview } from "./event-hover-prev";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  event: CalendarEvent;
  day: Date;
};

/** Shared keyboard, link and preview behavior for every calendar event. */
export const CalendarEventLink = ({ event, day, children, ...props }: Props) => (
  <HoverCard openDelay={300} closeDelay={100}>
    <HoverCardTrigger asChild>
      <Link href={event.link} {...props}>
        {children}
      </Link>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent>
        <EventHoverPreview event={event} day={day} />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCard>
);
