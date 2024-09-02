"use client";

import { useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  isSameDay,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { FaArrowLeft, FaArrowRight, FaArrowUp } from "react-icons/fa";

import { cn } from "@/utils/cn";
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

type Props = {
  events: Array<CalendarEvent>;
};

export const MonthCalendar = ({ events }: Props) => {
  const [month, setMonth] = useState(startOfMonth(new Date()));

  const handleUpdateMonth = (delta: number) => {
    setMonth((prevMonth) => addMonths(prevMonth, delta));
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

  const firstDay = month.getDay() > 0 ? month.getDay() - 1 : 6; //getDay goes from sunday, monday, ..., saturday
  const daysInMonth = eachDayOfInterval({ start: month, end: lastDayOfMonth(month) });

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => handleUpdateMonth(-1)}>
          <FaArrowLeft />
        </Button>
        <Heading level={2}>
          {months[month.getMonth()]}, {month.getFullYear()}
        </Heading>
        <Button variant="outline" onClick={() => handleUpdateMonth(1)}>
          <FaArrowRight />
        </Button>
      </div>
      <div className="grid grid-cols-7">
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
            <div
              key={index}
              className="relative flex min-h-20 flex-col border border-muted-foreground p-2"
            >
              <Heading className="absolute right-2 top-2 text-muted-foreground" level={3}>
                {day.getDate()}
              </Heading>
            </div>
          ),
        )}

        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className="flex min-h-20 flex-col gap-2 border border-muted-foreground p-2"
          >
            <Heading className="w-full justify-end" level={3}>
              {index + 1}
            </Heading>
            {events
              .filter((event) => isSameDay(event.date, day))
              .map((event, _) => (
                <HoverCard key={event.id} openDelay={300} closeDelay={100}>
                  <HoverCardTrigger>
                    <div className="overflow-hidden rounded-xl border-2 p-2 hover:bg-primary-hover">
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
        {Array.from({ length: firstDay }).map((_, index) => (
          <div
            key={index}
            className="relative flex min-h-20 flex-col border border-muted-foreground p-2"
          >
            <Heading className="absolute right-2 top-2 text-muted-foreground" level={3}>
              {index + 1}
            </Heading>
          </div>
        ))}
      </div>
    </div>
  );
};
