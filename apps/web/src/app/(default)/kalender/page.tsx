import { startOfMonth } from "date-fns";

import { Calendar } from "@/components/calendar/calendar";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default function CalendarPage() {
  return (
    <Container className="gap-5">
      <Heading className="pt-10">Kalender</Heading>
      <Calendar events={[]} month={startOfMonth(new Date())} />
    </Container>
  );
}
