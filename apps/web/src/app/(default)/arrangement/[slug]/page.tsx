import { cache } from "react";
import { notFound } from "next/navigation";

import { EventPage } from "@/components/event-page";
import { fetchHappeningBySlug } from "@/sanity/happening";
import { fetchRepeatingHappening } from "@/sanity/repeating-happening";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const getData = cache(async (slug: string) => {
  const event = await fetchHappeningBySlug(slug);
  if (event) {
    return event;
  }

  const repeatingEvent = await fetchRepeatingHappening(slug);
  if (repeatingEvent) {
    return repeatingEvent;
  }

  console.info(
    JSON.stringify({
      message: "Event not found",
      slug,
    }),
  );

  return notFound();
});

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const event = await getData(params.slug);

  return {
    title: event.title,
  };
};

export default async function EventPage_(props: Props) {
  const params = await props.params;
  const event = await getData(params.slug);

  return <EventPage event={event} />;
}
