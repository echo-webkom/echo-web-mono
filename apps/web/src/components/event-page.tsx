import { Suspense } from "react";
import Image from "next/image";

import { type fetchHappeningBySlug } from "@/sanity/happening";
import { CommentSection } from "./comments/comment-section";
import { Container } from "./container";
import { HappeningSidebar } from "./happening-sidebar";
import { Markdown } from "./markdown";
import { Heading } from "./typography/heading";

type EventPageProps = {
  // The awaited return type of fetchHappeningBySlug with null excluded from the type
  event: Exclude<Awaited<ReturnType<typeof fetchHappeningBySlug>>, null>;
};

export const EventPage = ({ event }: EventPageProps) => {
  return (
    <Container className="flex w-full py-10 md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        <HappeningSidebar event={event} />

        {/* Content */}
        <div className="w-full">
          <article>
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

          <Suspense fallback={null}>
            <CommentSection className="mt-10" id={`event_${event._id}`} />
          </Suspense>
        </div>
      </div>

      {/* <div className="mt-10 text-center text-muted-foreground">
        <Text size="sm" className="p-0">
          Publisert: {shortDate(event._createdAt)}
        </Text>
        <Text size="sm" className="p-0">
          Sist oppdatert: {shortDate(event._updatedAt)}
        </Text>
      </div> */}
    </Container>
  );
};
