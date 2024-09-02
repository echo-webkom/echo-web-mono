import { getDaysInMonth, startOfMonth, subDays } from "date-fns";

import { cn } from "@/utils/cn";
import { Heading } from "../typography/heading";

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
  month: Date;
};

export const Calendar = ({ month }: CalendarProps) => {
  month = startOfMonth(month);

  const weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  const firstDay = month.getDay() > 0 ? month.getDay() - 1 : 6; //getDay goes from sunday, monday, ..., saturday

  return (
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
            <Heading className="absolute right-4 top-4 text-muted-foreground" level={3}>
              {day.getDate()}
            </Heading>
          </div>
        ),
      )}

      {Array.from({ length: getDaysInMonth(month) }).map((_, index) => (
        <div
          key={index}
          className="relative flex min-h-20 flex-col border border-muted-foreground p-2 hover:bg-muted-dark"
        >
          <Heading className="absolute right-4 top-4" level={3}>
            {index + 1}
          </Heading>
        </div>
      ))}
      {Array.from({ length: firstDay }).map((_, index) => (
        <div
          key={index}
          className="relative flex min-h-20 flex-col border border-muted-foreground p-2"
        >
          <Heading className="absolute right-4 top-4 text-muted-foreground" level={3}>
            {index + 1}
          </Heading>
        </div>
      ))}
    </div>
  );
};
