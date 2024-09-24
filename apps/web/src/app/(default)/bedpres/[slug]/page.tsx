import { cache } from "react";
import { notFound } from "next/navigation";

import { EventPage } from "@/components/event-page";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";
import { getNewPageMetadata } from "@/app/seo";
import { norwegianDateString } from "@/utils/date";

type Props = {
  params: {
    slug: string;
  };
};

const getData = cache(async (slug: string) => {
  const bedpres = await fetchHappeningBySlug(slug);

  if (!bedpres) {
    console.info("Bedpres not found", {
      slug,
    });
    return notFound();
  }

  return bedpres;
});

export const generateMetadata = async ({ params }: Props) => {
  const bedpress = await getData(params.slug);

  const regDate = bedpress.registrationStart ?
    `Påmelding åpner ${norwegianDateString(new Date(bedpress.registrationStart)).toLowerCase()}.`
    : "";

  return getNewPageMetadata(
    bedpress.title,
    `Ny bedpress med ${bedpress.company?.name}, ${norwegianDateString(new Date(bedpress.date)).toLowerCase()},
    ${bedpress.location?.name}. ${regDate}`
  );
};

export default async function BedpresPage({ params }: Props) {
  const bedpres = await getData(params.slug);

  return <EventPage event={bedpres} />;
}
