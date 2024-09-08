import { happeningsToCalendarEvent, moviesToCalendarEvent } from "@/components/calendar/calendar";
import { DaysCalendar as EventCalendar } from "@/components/calendar/days-calendar";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

export const Calendar = async ({ className }: { className?: string }) => {
  const [happenings, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);

  const calendarEvents = happeningsToCalendarEvent(happenings).concat(
    moviesToCalendarEvent(movies),
  );

  return (
    <div className={className}>
      <EventCalendar events={calendarEvents} />
    </div>
  );
};
