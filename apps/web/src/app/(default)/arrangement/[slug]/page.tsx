import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { log } from "next-axiom";

import { Container } from "@/components/container";
import { HappeningSidebar } from "@/components/happening-sidebar";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { fetchHappeningBySlug } from "@/sanity/happening/requests";
import { shortDate } from "@/utils/date";

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

export default async function EventPage({ params }: Props) {
  const event = await getData(params.slug);

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        <HappeningSidebar event={event} />

        {/* Content */}
        <article className="w-full">
          <Heading>{event.title}</Heading>

          {event.body ? (
            <Markdown content={event.body} />
          ) : (
            <div className="mx-auto flex w-fit flex-col gap-8 p-5">
              <h3 className="text-center text-xl font-medium">Mer informasjon kommer!</h3>
              <Image
                className="rounded-lg"
                src="/gif/wallace-construction.gif"
                alt="Wallace hammering"
                width={400}
                height={400}
              />
            </div>
          )}
        </article>
      </div>

      <div className="pt-10 text-center text-muted-foreground lg:mt-auto">
        <Text size="sm" className="p-0">
          Publisert: {shortDate(event._createdAt)}
        </Text>
        <Text size="sm" className="p-0">
          Sist oppdatert: {shortDate(event._updatedAt)}
        </Text>
      </div>
    </Container>
  );
}
