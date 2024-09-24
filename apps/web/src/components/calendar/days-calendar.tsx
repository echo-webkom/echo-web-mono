"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { addDays, getWeek, isSameDay, startOfWeek } from "date-fns";

import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";
import { dateIsBetween, dayStr, shortDateNoTime } from "@/utils/date";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { EventHoverPreview } from "./event-hover-prev";

type Props = {
  events: Array<CalendarEvent>;
  steps: number;
  setWeekText?: (topText: string) => void;
  isWeek?: boolean;
};

const getInterval = (width: number, isWeek?: boolean) => {
  if (width < 640) return 1;
  if (width < 1024) return 3;
  if (isWeek) return 7;
  return 5;
};

const calculateStartDate = (steps: number, interval: number) => {
  const contextDate = addDays(new Date(), interval * steps);
  if (interval !== 7) {
    return contextDate;
  }
  return startOfWeek(contextDate, { weekStartsOn: 1 });
};

export const DaysCalendar = ({ events, isWeek, steps, setWeekText }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [calendarWidth, setCalendarWidth] = useState(1024);
  const interval = useMemo(() => getInterval(calendarWidth, isWeek), [calendarWidth, isWeek]);

  const startDate = useMemo(() => calculateStartDate(steps, interval), [steps, interval]);

  const days = Array.from({ length: interval }, (_, i) => addDays(startDate, i));

  const week = useCallback(() => {
    const firstWeek = getWeek(days[0]!, { weekStartsOn: 1 });

    if (days.length === 1) return firstWeek;

    const lastWeek = getWeek(days[days.length - 1]!, { weekStartsOn: 1 });

    if (firstWeek === lastWeek) return firstWeek;

    return `${firstWeek} - ${lastWeek}`;
  }, [days]);

  useEffect(() => {
    const onResize = () => {
      if (!ref.current) return;
      setCalendarWidth(ref.current.offsetWidth);
    };

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (setWeekText) {
      setWeekText(`uke ${week()}`);
    }
  }, [setWeekText, startDate, steps, week]);

  return (
    <div ref={ref} className="space-y-4">
      <div className="h-72 overflow-hidden rounded-lg border-2">
        <div
          className="h-full divide-x"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${interval}, 1fr)`,
          }}
        >
          {days.map((day) => {
            const isToday = isSameDay(day, new Date());

            const eventsThisDay = events.filter((event) => {
              return event.endDate
                ? isSameDay(event.date, day) || dateIsBetween(day, event.date, event.endDate)
                : isSameDay(event.date, day);
            });

            return (
              <div key={day.toString()}>
                <div className="flex flex-col gap-2">
                  <div className="flex h-16 flex-col items-center justify-center border-b-2 bg-muted py-2 font-medium">
                    {isToday ? (
                      <p>I dag</p>
                    ) : (
                      <>
                        <p>{dayStr(day)}</p>
                        <p>{shortDateNoTime(day)}</p>
                      </>
                    )}
                  </div>

                  <ul className="flex flex-col gap-1 px-1">
                    {eventsThisDay.map((event) => {
                      return (
                        <HoverCard key={event.id} openDelay={300} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div
                              className={cn("overflow-hidden border-l-4 p-2", {
                                "border-primary hover:bg-primary-hover": event.type === "bedpres",
                                "border-secondary hover:bg-secondary": event.type === "event",
                                "border-pink-400 hover:bg-pink-400": event.type === "movie",
                              })}
                            >
                              <Link
                                href={event.link}
                                className="line-clamp-1 text-sm font-semibold"
                              >
                                {event.title}
                              </Link>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <EventHoverPreview event={event} />
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
