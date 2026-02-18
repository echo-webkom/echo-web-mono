"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  getDaysInMonth,
  getMonth,
  isSameDay,
  isSameMonth,
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
import { dateIsBetween } from "@/utils/date";

const CalendarDay = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("bg-background relative flex min-h-20 flex-col overflow-hidden p-2", className)}
  >
    {children}
  </div>
);

const DayCircle = ({
  variant = "default",
  children,
}: {
  variant?: "default" | "active" | "muted";
  children: React.ReactNode;
}) => (
  <div
    className={cn("ml-auto flex h-7 w-7 items-center justify-center rounded-full", {
      "bg-red-400 text-white": variant === "active",
      "bg-transparent": variant === "default",
      "text-muted-foreground": variant === "muted",
    })}
  >
    {children}
  </div>
);

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
  const allDays = eachDayOfInterval({
    start: subDays(month, firstDay),
    end: addDays(lastDayOfMonth(month), 7 - ((firstDay + getDaysInMonth(month)) % 7)),
  });

  useEffect(() => {
    if (setMonthText) {
      setMonthText(`${months[getMonth(month)]} ${month.getFullYear()}`);
    }
  }, [month, setMonthText, steps]);

  const BIRTHDAY = new Date(2025, 10, 7, 12, 0, 0);

  return (
    <div className="border-border w-full overflow-x-scroll rounded-xl border-2 md:overflow-hidden">
      <div className="border-border bg-border grid min-w-200 grid-cols-7 gap-0.5 border-b-2">
        {weekdays.map((day) => (
          <Heading
            level={3}
            key={day}
            className={cn(
              "bg-muted flex h-16 place-items-baseline justify-end p-2",
              ["Lør", "Søn"].includes(day) && "text-muted-foreground",
            )}
          >
            {day}
          </Heading>
        ))}
      </div>
      <div className="bg-border grid min-w-200 grid-cols-7 gap-0.5">
        {allDays.map((day, _) => (
          <CalendarDay key={day.toString()}>
            <DayCircle
              variant={
                (isToday(day) && "active") || (!isSameMonth(month, day) && "muted") || "default"
              }
            >
              {day.getDate()}
            </DayCircle>
            {(() => {
              const isBirthday = isSameDay(day, BIRTHDAY);

              return (
                <>
                  {isBirthday && (
                    <span className="text-foreground/90 bg-background/80 absolute top-2 left-2 rounded px-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm">
                      Gratulerer med dagen!
                    </span>
                  )}

                  {isBirthday && (
                    <div className="pointer-events-none absolute inset-x-2 top-7 left-3 grid h-18">
                      <div className="text-1xl leading-tight font-medium">
                        echo
                        <br />
                        BURSDAG 🎉
                      </div>
                    </div>
                  )}

                  {isBirthday && <div className="h-10" />}
                </>
              );
            })()}

            {events
              .filter((event) => {
                return event.endDate
                  ? isSameDay(event.date, day) || dateIsBetween(day, event.date, event.endDate)
                  : isSameDay(event.date, day);
              })
              .map((event, _) => (
                <HoverCard key={event.id} openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div
                      className={cn("hover:bg-muted-dark overflow-hidden border-l-4 p-2", {
                        "border-primary hover:bg-primary-hover": event.type === "bedpres",
                        "border-secondary hover:bg-secondary": event.type === "event",
                        "border-pink-400 hover:bg-pink-400": event.type === "movie",
                        "border-green-600 hover:bg-green-600": event.type === "boardgame",
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
          </CalendarDay>
        ))}
      </div>
    </div>
  );
};
