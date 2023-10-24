import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/ui/heading";
import { fetchEventBySlug } from "@/sanity/event";
import { EventSidebar } from "./event-sidebar";

type Props = {
  params: {
    slug: string;
  };
};

async function getData(slug: string) {
  const event = await fetchEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  return event;
}

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
        <EventSidebar slug={params.slug} event={event} />

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

      <div className="flex flex-col gap-3 pt-10 text-center text-sm text-muted-foreground lg:mt-auto">
        <p>Publisert: {new Date(event._createdAt).toLocaleDateString()}</p>
        <p>Sist oppdatert: {new Date(event._updatedAt).toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
