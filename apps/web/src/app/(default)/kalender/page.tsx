import { MonthCalendar } from "@/components/calendar/month-calendar";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";
import { happeningsToCalendarEvent, moviesToCalendarEvent } from "../hjem/_components/_lib/mappers";

export default async function CalendarPage() {
  const [happenings, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);

  const calendarEvents = happeningsToCalendarEvent(happenings).concat(
    moviesToCalendarEvent(movies),
  );

  return (
    <Container className="gap-5">
      <Heading className="pt-10">Kalender</Heading>
      <MonthCalendar events={calendarEvents} />
    </Container>
  );
}
