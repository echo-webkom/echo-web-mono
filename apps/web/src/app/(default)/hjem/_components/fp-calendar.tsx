import { Calendar } from "@/components/calendar/calendar";
import { getCalendarEvents } from "@/lib/calendar-events";

export const FPCalendar = async ({ className }: { className?: string }) => {
  const calendarEvents = await getCalendarEvents();

  return (
    <div className={className}>
      <Calendar events={calendarEvents} type="week" />
    </div>
  );
};
