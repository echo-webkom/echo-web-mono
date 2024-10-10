import { cache } from "react";
import { notFound } from "next/navigation";

import { EventPage } from "@/components/event-page";
import { fetchHappeningBySlug } from "@/sanity/happening";
import { norwegianDateString } from "@/utils/date";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const event = await fetchHappeningBySlug(slug);

  if (!event) {
    console.info("Bedpres not found", {
      slug,
    });
    return notFound();
  }

  return event;
});

export const generateMetadata = async ({ params }: Props) => {
  const event = await getData(params.slug);

  const regDate = event.registrationStart
    ? `Påmelding åpner ${norwegianDateString(new Date(event.registrationStart)).toLowerCase()}.`
    : "";

  return {
    title: event.title,
    description: `Ny bedriftspresentasjon med ${event.company?.name}, ${norwegianDateString(new Date(event.date)).toLowerCase()},
    ${event.location?.name}. ${regDate}`,
  };
};

export default async function BedpresPage({ params }: Props) {
  const event = await getData(params.slug);

  return <EventPage event={event} />;
}
