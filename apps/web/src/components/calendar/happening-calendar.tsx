"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { addDays, getWeek, isSameDay, startOfWeek, subDays } from "date-fns";

import { cn } from "@/utils/cn";
import { dateIsBetween, dayStr, shortDateNoTime } from "@/utils/date";
import { Heading } from "../typography/heading";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  body: string;
  link: string;
};

type CalendarProps = {
  events: Array<CalendarEvent>;
};

const getInterval = (width: number) => {
  if (width < 640) return 1;
  if (width < 1024) return 3;
  return 5;
};

export function Calendar({ events }: CalendarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [calendarWidth, setCalendarWidth] = useState(0);
  const interval = useMemo(() => getInterval(calendarWidth), [calendarWidth]);
  const [date, setDate] = useState(
    interval === 1 ? new Date() : startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const days = Array.from({ length: interval }, (_, i) => addDays(date, i));

  const week = () => {
    const firstWeek = getWeek(days[0]!);

    if (days.length === 1) return firstWeek;

    const lastWeek = getWeek(days[days.length - 1]!);

    if (firstWeek === lastWeek) return firstWeek;

    return `${firstWeek} - ${lastWeek}`;
  };

  const handleNextWeek = () => {
    setDate((prev) => addDays(prev, interval));
  };

  const handlePrevWeek = () => {
    setDate((prev) => subDays(prev, interval));
  };

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

  return (
    <div ref={ref} className="space-y-4">
      <div ref={ref} className="mb-4 flex justify-between">
        <Heading level={2}>Uke {week()}</Heading>

        <div className="flex justify-center gap-3">
          <Button onClick={handlePrevWeek} size="sm">
            Forrige
          </Button>
          <Button size="sm" onClick={() => setDate(new Date())}>
            Idag
          </Button>
          <Button onClick={handleNextWeek} size="sm">
            Neste
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
          <Circle className="bg-red-400" />
          Bedpres
        </div>
        <div className="flex items-center gap-1">
          <Circle className="bg-blue-400" />
          Annet
        </div>
      </div>

      <div className="mb-10 h-72 overflow-hidden rounded-lg border">
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
                  <div className="flex h-16 flex-col items-center justify-center border-b bg-muted py-2 font-medium">
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
                        <HoverCard key={event.id}>
                          <HoverCardTrigger>
                            <div className="overflow-hidden rounded-lg border p-2">
                              <p className="line-clamp-1 text-sm font-medium">{event.title}</p>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <div className="space-y-2">
                              <p className="font-medium">
                                <Link className="hover:underline" href={event.link}>
                                  {event.title}
                                </Link>
                              </p>

                              <p className="text-sm">
                                {event.body.slice(0, 250)}
                                {(event.body.length ?? 0) > 250 && "..."}
                              </p>
                              <div>
                                <Link
                                  href={event.link}
                                  className="text-sm font-medium italic hover:underline"
                                >
                                  Les mer
                                </Link>
                              </div>
                            </div>
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
}

function Circle({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("h-4 w-4 rounded-full", className)} {...props} />;
}
