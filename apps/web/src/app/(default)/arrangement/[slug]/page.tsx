import { cache } from "react";
import { notFound } from "next/navigation";
import { log } from "next-axiom";

import { HappeningPage } from "@/components/happening/happening-page";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const event = await fetchHappeningBySlug(slug);

  if (!event) {
    log.info("Event not found", {
      slug,
    });
    return notFound();
  }

  return event;
});

export async function generateMetadata({ params }: Props) {
  const event = await getData(params.slug);

  return {
    title: event.title,
  };
}

export default async function EventPage_({ params }: Props) {
  const event = await getData(params.slug);

  return <HappeningPage happening={event} />;
}
