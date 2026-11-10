"use client";

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
import { useEffect, useMemo } from "react";

import { CalendarDayEvents } from "@/components/calendar/calendar-day-events";
import { CalendarMultiDayEvents } from "@/components/calendar/calendar-multi-day-events";
import { Heading } from "@/components/typography/heading";
import { calendarMultiDayLayout, calendarDayPadding } from "@/lib/calendar-event-display";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

const CalendarDay = ({
  children,
  className,
  column,
}: {
  children: React.ReactNode;
  className?: string;
  column: number;
}) => (
  <div
    className={cn(
      "bg-background relative row-span-3 row-start-1 grid min-w-0 grid-rows-subgrid",
      className,
    )}
    style={{ gridColumn: column }}
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
  showLongEvents?: boolean;
  compactMultiDay?: boolean;
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

export const MonthCalendar = ({
  events,
  steps,
  setMonthText,
  showLongEvents,
  compactMultiDay = false,
}: Props) => {
  const month = useMemo(() => addMonths(startOfMonth(new Date()), steps), [steps]);
  const firstDay = month.getDay() > 0 ? month.getDay() - 1 : 6; //getDay goes from sunday, monday, ..., saturday
  const allDays = eachDayOfInterval({
    start: subDays(month, firstDay),
    end: addDays(lastDayOfMonth(month), (7 - ((firstDay + getDaysInMonth(month)) % 7)) % 7),
  });

  const weeks = Array.from({ length: allDays.length / 7 }, (_, i) =>
    allDays.slice(i * 7, i * 7 + 7),
  );

  useEffect(() => {
    if (setMonthText) {
      setMonthText(`${months[getMonth(month)]} ${month.getFullYear()}`);
    }
  }, [month, setMonthText, steps]);

  const BIRTHDAY = new Date(2025, 10, 7, 12, 0, 0);

  return (
    <div className="border-border w-full overflow-x-scroll [--calendar-compact-height:20px] sm:[--calendar-compact-height:16px] md:overflow-hidden">
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
      <div className="min-w-200">
        {weeks.map((days) => {
          const layout = calendarMultiDayLayout(events, days, showLongEvents);
          const { occupiedRows } = layout;
          return (
            <div key={days[0]!.toISOString()} className="border-b">
              <div className="bg-border grid grid-cols-7 grid-rows-[auto_auto_1fr] gap-x-0.5">
                {days.map((day, index) => (
                  <CalendarDay key={day.toString()} column={index + 1}>
                    <div className="p-2">
                      <DayCircle
                        variant={
                          (isToday(day) && "active") ||
                          (!isSameMonth(month, day) && "muted") ||
                          "default"
                        }
                      >
                        {day.getDate()}
                      </DayCircle>
                    </div>
                    <div
                      className="relative row-span-2 row-start-2 min-h-10 p-2"
                      style={{
                        paddingTop: calendarDayPadding(occupiedRows[index]!, compactMultiDay),
                      }}
                    >
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

                      <CalendarDayEvents
                        events={events}
                        day={day}
                        showLongEvents={showLongEvents}
                      />
                    </div>
                  </CalendarDay>
                ))}
                <div className="pointer-events-none z-10 col-span-full col-start-1 row-start-2 min-w-0">
                  <CalendarMultiDayEvents
                    layout={layout}
                    compact={compactMultiDay}
                    events={events}
                    days={days}
                    showLongEvents={showLongEvents}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
