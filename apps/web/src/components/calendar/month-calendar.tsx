"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  getMonth,
  isSameDay,
  isToday,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";

import { EventHoverPreview } from "@/components/calendar/event-hover-prev";
import { Heading } from "@/components/typography/heading";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

type Props = {
  events: Array<CalendarEvent>;
  steps: number;
  setMonthText?: (topText: string) => void;
};

const weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const months = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const MonthCalendar = ({ events, steps, setMonthText }: Props) => {
  const month = useMemo(() => addMonths(startOfMonth(new Date()), steps), [steps]);
  const firstDay = month.getDay() > 0 ? month.getDay() - 1 : 6; //getDay goes from sunday, monday, ..., saturday
  const daysInMonth = eachDayOfInterval({ start: month, end: lastDayOfMonth(month) });

  useEffect(() => {
    if (setMonthText) {
      setMonthText(`${months[getMonth(month)]} ${month.getFullYear()}`);
    }
  }, [month, setMonthText, steps]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="h-[600px] w-full overflow-y-auto overflow-x-scroll md:h-auto">
        <div className="sticky top-0 grid min-w-[50rem] grid-cols-7 bg-background">
          {weekdays.map((day) => (
            <Heading
              level={2}
              key={day}
              className={cn(
                "flex h-10 items-center justify-end border-b border-muted-foreground px-2 py-6",
                ["Lør", "Søn"].includes(day) && "text-muted-foreground",
              )}
            >
              {day}
            </Heading>
          ))}
        </div>
        <div className="grid min-w-[50rem] grid-cols-7">
          {Array.from({ length: firstDay }, (_, i) => subDays(month, firstDay - i)).map(
            (day, index) => (
              <div
                key={index}
                className="flex min-h-20 flex-col border border-muted-foreground p-2"
              >
                <Heading className="w-full justify-end text-muted-foreground" level={3}>
                  {day.getDate()}
                </Heading>
              </div>
            ),
          )}

          {daysInMonth.map((day, index) => (
            <div
              key={index}
              className={cn(
                "flex min-h-20 flex-col gap-2 border border-muted-foreground p-2",
                isToday(day) && "bg-accent",
              )}
            >
              <Heading className="w-full justify-end" level={3}>
                {index + 1}
              </Heading>
              {events
                .filter((event) => isSameDay(event.date, day))
                .map((event, _) => (
                  <HoverCard key={event.id} openDelay={300} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn("overflow-hidden border-l-4 p-2", {
                          "border-primary hover:bg-primary-hover": event.type === "bedpres",
                          "border-secondary hover:bg-secondary": event.type === "event",
                          "border-pink-400 hover:bg-pink-400": event.type === "movie",
                        })}
                      >
                        <Link href={event.link} className="line-clamp-1 text-sm font-semibold">
                          {event.title}
                        </Link>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <EventHoverPreview event={event} />
                    </HoverCardContent>
                  </HoverCard>
                ))}
            </div>
          ))}
          {Array.from({ length: 7 - ((firstDay + daysInMonth.length) % 7) }).map((_, index) => (
            <div key={index} className="flex min-h-20 flex-col border border-muted-foreground p-2">
              <Heading className="w-full justify-end text-muted-foreground" level={3}>
                {index + 1}
              </Heading>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
