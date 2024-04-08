import removeMarkdown from "remove-markdown";

import { Calendar as EventCalendar } from "@/components/calendar/happening-calendar";
import { createHappeningLink } from "@/lib/create-link";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

function happeningsToCalendarEvent(happenings: Awaited<ReturnType<typeof fetchAllHappenings>>) {
  return happenings
    .filter((happening) => Boolean(happening.date))
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date!),
      body: removeMarkdown(happening.body ?? ""),
      link: createHappeningLink(happening),
    }));
}

function moviesToCalendarEvent(movies: Awaited<ReturnType<typeof fetchMovies>>) {
  return movies.map((movie) => ({
    id: movie._id,
    title: `Film: ${movie.title}`,
    date: new Date(movie.date),
    body: `Se ${movie.title} med filmklubben!`,
    link: movie.link,
  }));
}

export async function Calendar({ className }: { className?: string }) {
  const [happenings, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);

  const calendarEvents = happeningsToCalendarEvent(happenings).concat(
    moviesToCalendarEvent(movies),
  );

  return (
    <div className={className}>
      <EventCalendar events={calendarEvents} />
    </div>
  );
}
