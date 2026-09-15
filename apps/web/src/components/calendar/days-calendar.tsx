"use client";

import { addDays, getWeek, isSameDay, startOfWeek, type Day } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { calendarMultiDayLayout, calendarMultiDayHeight } from "@/lib/calendar-event-display";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { dayStr, shortDateNoTime } from "@/utils/date";

import { CalendarDayEvents } from "./calendar-day-events";
import { CalendarMultiDayEvents } from "./calendar-multi-day-events";

type Props = {
  events: Array<CalendarEvent>;
  steps: number;
  setWeekText?: (topText: string) => void;
  isWeek?: boolean;
  showLongEvents: boolean;
  compactMultiDay?: boolean;
  weekStartsToday: boolean;
};

const BIRTHDAY = new Date(2025, 10, 7);
const isEchoBirthday = (d: Date) => isSameDay(d, BIRTHDAY);

const getInterval = (width: number, isWeek?: boolean) => {
  if (width < 640) return 1;
  if (width < 1024) return 3;
  if (isWeek) return 7;
  return 5;
};

const calculateStartDate = (steps: number, interval: number, weekStartsOn: Day) => {
  const contextDate = addDays(new Date(), interval * steps);
  if (interval !== 7) {
    return contextDate;
  }
  return startOfWeek(contextDate, { weekStartsOn });
};

/**
 * The normal week calendar (not the month one).
 *
 * @param events Calendar events to show
 * @param isWeek Determines number of days to show (7)
 * @param steps How many steps ahead/behind you are (calendar arrow buttons). For days calendar this means amount of weeks as interval is always 7.
 * @param setWeekText Function to set calendar title (Uke x)
 * @param showLongEvents Boolean to toggle viewing events that span more than one day or not. Always shows the first day.
 * @param weekStartsToday Boolean to toggle having today or monday as the first day in the calendar
 */
export const DaysCalendar = ({
  events,
  isWeek,
  steps,
  setWeekText,
  showLongEvents,
  weekStartsToday,
  compactMultiDay = false,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [calendarWidth, setCalendarWidth] = useState(1024);
  const interval = useMemo(() => getInterval(calendarWidth, isWeek), [calendarWidth, isWeek]);

  // Calculate which days to show based on which day it is and when the week starts (today or monday).
  const weekStartsOn = weekStartsToday && steps === 0 ? (new Date().getDay() as Day) : 1;
  const startDate = useMemo(
    () => calculateStartDate(steps, interval, weekStartsOn),
    [steps, interval, weekStartsOn],
  );
  const days = Array.from({ length: interval }, (_, i) => addDays(startDate, i));

  const { occupiedRows } = calendarMultiDayLayout(events, days, showLongEvents);

  // Calculate week number to show (eg. Uke 1-2)
  const week = useCallback(() => {
    const firstWeek = getWeek(days[0]!, { weekStartsOn: 1 });
    if (days.length === 1) return firstWeek;

    const lastWeek = getWeek(days[days.length - 1]!, { weekStartsOn: 1 });
    if (firstWeek === lastWeek) return firstWeek;

    return `${firstWeek} - ${lastWeek}`;
  }, [days, weekStartsOn]);

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
      <div className="min-h-72">
        <div
          className="min-h-72 grid-rows-[auto_auto_1fr] divide-x"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${interval}, 1fr)`,
          }}
        >
          {days.map((day, index) => {
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                className="bg-background row-span-3 row-start-1 grid min-w-0 grid-rows-subgrid"
                style={{ gridColumn: index + 1 }}
              >
                <div className="contents">
                  <div className="bg-muted flex h-16 flex-col items-center justify-center border-b py-2 font-medium">
                    {isToday ? (
                      <p>I dag</p>
                    ) : (
                      <>
                        <p>{dayStr(day)}</p>
                        <p>{shortDateNoTime(day)}</p>
                      </>
                    )}
                  </div>
                  <div
                    className="row-span-2 row-start-2 space-y-2"
                    style={{
                      paddingTop:
                        occupiedRows[index]! * (calendarMultiDayHeight(compactMultiDay) + 4) + 8,
                    }}
                  >
                    {isEchoBirthday(day) && (
                      <>
                        <div className="-mt-1 px-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50/70 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
                            🎂 Gratulerer med dagen echo!
                          </span>
                        </div>
                        <div className="px-2 pt-2">
                          <div className="h-10 text-center text-xl leading-snug font-semibold">
                            🎊 echo 30 år 🎊
                          </div>
                        </div>
                      </>
                    )}

                    <div className="px-1">
                      <CalendarDayEvents
                        events={events}
                        day={day}
                        showLongEvents={showLongEvents}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="pointer-events-none z-10 col-span-full col-start-1 row-start-2 min-w-0">
            <CalendarMultiDayEvents
              compact={compactMultiDay}
              events={events}
              days={days}
              showLongEvents={showLongEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
