import { cache } from "react";
import { notFound } from "next/navigation";

import { EventPage } from "@/components/event-page";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const event = await fetchHappeningBySlug(slug);

  if (!event) {
    console.info("Event not found", {
      slug,
    });
    return notFound();
  }

  return event;
});

export const generateMetadata = async ({ params }: Props) => {
  const event = await getData(params.slug);

  return {
    title: event.title,
  };
};

export default async function EventPage_({ params }: Props) {
  const event = await getData(params.slug);

  return <EventPage event={event} />;
}
