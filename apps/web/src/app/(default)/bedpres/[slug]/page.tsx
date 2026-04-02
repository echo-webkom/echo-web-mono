import { cache } from "react";
import { notFound } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { EventPage } from "@/components/happening/event-page";
import { norwegianDateString } from "@/utils/date";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const getData = cache(async (slug: string) => {
  const event = await unoWithAdmin.sanity.happenings.bySlug(slug).catch(() => null);

  if (!event) {
    console.info(
      JSON.stringify({
        message: "Bedpres not found",
        slug,
      }),
    );
    return notFound();
  }

  return event;
});

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const event = await getData(params.slug);

  const regDate = event.registrationStart
    ? `Påmelding åpner ${norwegianDateString(new Date(event.registrationStart)).toLowerCase()}.`
    : "";

  return {
    title: event.title,
    description: `Ny bedriftspresentasjon med ${event.company?.name}, ${event.date ? norwegianDateString(new Date(event.date)).toLowerCase() : ""},
    ${event.location?.name}. ${regDate}`,
  };
};

export default async function BedpresPage(props: Props) {
  const params = await props.params;
  const event = await getData(params.slug);

  return <EventPage event={event} />;
}
