import { DaysCalendar } from "@/components/calendar/days-calendar";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { happeningsToCalendarEvent, moviesToCalendarEvent } from "@/lib/calendar-event-helpers";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

export default async function CalendarPage() {
  const [happenings, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);

  const events = happeningsToCalendarEvent(happenings).concat(moviesToCalendarEvent(movies));

  return (
    <Container className="gap-5">
      <Heading className="pt-10">Kalender</Heading>
      <Tabs defaultValue="maned">
        <TabsList>
          <TabsTrigger value="maned" className="">
            Månedskalender
          </TabsTrigger>
          <TabsTrigger value="uke" className="">
            Ukeskalender
          </TabsTrigger>
        </TabsList>
        <TabsContent value="maned">
          <MonthCalendar events={events} />
        </TabsContent>
        <TabsContent value="uke">
          <DaysCalendar events={events} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
