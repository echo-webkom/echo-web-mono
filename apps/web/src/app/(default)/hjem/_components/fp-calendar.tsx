import { Calendar } from "@/components/calendar/calendar";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

export const FPCalendar = ({
  calendarEvents,
  className,
}: {
  calendarEvents: Array<CalendarEvent>;
  className?: string;
}) => {
  return (
    <div className={cn("overflow-hidden rounded-md border bg-card shadow-sm", className)}>
      <Calendar events={calendarEvents} type="week" />
    </div>
  );
};
