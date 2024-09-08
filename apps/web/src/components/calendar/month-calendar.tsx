"use client";

import { useState } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import {
  addMonths,
  eachDayOfInterval,
  isSameDay,
  isThisMonth,
  isToday,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { BiReset } from "react-icons/bi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";
import { Heading } from "../typography/heading";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

type Props = {
  events: Array<CalendarEvent>;
};

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

const weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export const MonthCalendar = ({ events }: Props) => {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  const handleUpdateMonth = (delta: number) => {
    setMonth((prevMonth) => addMonths(prevMonth, delta));
  };

  const firstDay = month.getDay() > 0 ? month.getDay() - 1 : 6; //getDay goes from sunday, monday, ..., saturday
  const daysInMonth = eachDayOfInterval({ start: month, end: lastDayOfMonth(month) });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full max-w-md items-center gap-2">
        <Button variant="outline" onClick={() => handleUpdateMonth(-1)}>
          <FaArrowLeft />
        </Button>
        <Heading level={2} className="flex-1 justify-center">
          {months[month.getMonth()]} {month.getFullYear()}
        </Heading>
        {!isThisMonth(month) && (
          <Button
            variant="outline"
            className=""
            size="icon"
            onClick={() => setMonth(startOfMonth(new Date()))}
          >
            <BiReset />
          </Button>
        )}
        <Button variant="outline" onClick={() => handleUpdateMonth(1)}>
          <FaArrowRight />
        </Button>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-7">
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

        {Array.from({ length: firstDay }, (_, i) => subDays(month, firstDay - i)).map(
          (day, index) => (
            <div key={index} className="flex min-h-20 flex-col border border-muted-foreground p-2">
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
                      className={cn("overflow-hidden rounded-xl border-2 p-2", {
                        "border-blue-500 hover:bg-blue-400": event.type === "bedpres",
                        "border-green-500 hover:bg-green-400": event.type === "event",
                        "border-red-500 hover:bg-red-400": event.type === "movie",
                      })}
                    >
                      <Link href={event.link} className="line-clamp-1 text-sm font-semibold">
                        {event.title}
                      </Link>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <Link className="hover:underline" href={event.link}>
                        <h3 className="line-clamp-1 text-ellipsis font-semibold">{event.title}</h3>
                      </Link>

                      <p className="text-sm font-medium">
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
      <div className="flex w-full max-w-5xl gap-4 p-5">
        <div className="mr-2 flex items-center">
          <div className="mr-1 h-4 w-4 rounded-full bg-blue-500"></div>
          <div>Bedpres</div>
        </div>
        <div className="mr-2 flex items-center">
          <div className="mr-1 h-4 w-4 rounded-full bg-green-500"></div>
          <div>Arrangement</div>
        </div>
        <div className="mr-2 flex items-center">
          <div className="mr-1 h-4 w-4 rounded-full bg-red-500"></div>
          <div>Film</div>
        </div>
        <div className="flex items-center">
          <div className="mr-1 h-4 w-4 rounded-full bg-gray-600"></div>
          <div>Annet</div>
        </div>
      </div>
    </div>
  );
};
