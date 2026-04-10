import { Calendar } from "@/components/calendar/calendar";
import { getCalendarEvents } from "@/lib/calendar-events";
import { cn } from "@/utils/cn";

export const FPCalendar = async ({ className }: { className?: string }) => {
  const calendarEvents = await getCalendarEvents();

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-sm", className)}>
      <Calendar events={calendarEvents} type="week" />
    </div>
  );
};
