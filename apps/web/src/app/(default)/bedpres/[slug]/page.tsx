import { cache } from "react";
import { notFound } from "next/navigation";
import { log } from "next-axiom";

import { EventPage } from "@/components/event-page";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const bedpres = await fetchHappeningBySlug(slug);

  if (!bedpres) {
    log.info("Bedpres not found", {
      slug,
    });
    return notFound();
  }

  return bedpres;
});

export const generateMetadata = async ({ params }: Props) => {
  const bedpres = await getData(params.slug);

  return {
    title: bedpres.title,
  };
};

export default async function BedpresPage({ params }: Props) {
  const bedpres = await getData(params.slug);

  return <EventPage event={bedpres} />;
}
