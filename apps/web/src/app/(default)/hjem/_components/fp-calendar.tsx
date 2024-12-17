import { Calendar } from "@/components/calendar/calendar";
import {
  boardgamesToCalendarEvent,
  happeningsToCalendarEvent,
  moviesToCalendarEvent,
} from "@/lib/calendar-event-helpers";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

export const FPCalendar = async ({ className }: { className?: string }) => {
  const [happenings, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);

  const calendarEvents = happeningsToCalendarEvent(happenings)
    .concat(moviesToCalendarEvent(movies))
    .concat(boardgamesToCalendarEvent());

  return (
    <div className={className}>
      <Calendar events={calendarEvents} type="week" />
    </div>
  );
};
