import { Calendar as EventCalendar } from "@/components/calendar/happening-calendar";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";
import { happeningsToCalendarEvent, moviesToCalendarEvent } from "./_lib/mappers";

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
