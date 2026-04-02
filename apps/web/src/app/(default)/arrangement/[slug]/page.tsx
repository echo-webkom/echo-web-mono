import { notFound } from "next/navigation";
import { cache } from "react";

import { unoWithAdmin } from "@/api/server";
import { EventPage } from "@/components/happening/event-page";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const getData = cache(async (slug: string) => {
  const event = await unoWithAdmin.sanity.happenings.bySlug(slug).catch(() => null);
  if (event) {
    return event;
  }

  const repeatingEvent = await unoWithAdmin.sanity.happenings
    .repeatingBySlug(slug)
    .catch(() => null);
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
