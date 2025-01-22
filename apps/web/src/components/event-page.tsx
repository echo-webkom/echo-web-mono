import { Suspense } from "react";
import Image from "next/image";

import { type fetchHappeningBySlug } from "@/sanity/happening";
import { type fetchRepeatingHappening } from "@/sanity/repeating-happening";
import { CommentSection } from "./comments/comment-section";
import { CompanyLeagueBanner } from "./company-league-banner";
import { Container } from "./container";
import { HappeningSidebar } from "./happening-sidebar";
import { Markdown } from "./markdown";
import { RepeatingHappeningSidebar } from "./repeating-happening-sidebar";
import { Heading } from "./typography/heading";

type EventPageProps = {
  // The awaited return type of fetchHappeningBySlug or fetchRepeatingHappening with null excluded from the type
  event: Exclude<
    Awaited<ReturnType<typeof fetchHappeningBySlug | typeof fetchRepeatingHappening>>,
    null
  >;
};

export const EventPage = ({ event }: EventPageProps) => {
  const isCompanyLeague = event.body?.toLowerCase().includes("databrus fc");

  return (
    <div>
      {isCompanyLeague && (
        <div className="pt-6">
          <CompanyLeagueBanner />
        </div>
      )}

      <Container className="relative flex w-full gap-24 py-10 lg:max-w-[1500px] lg:flex-row">
        {event?._type === "happening" && <HappeningSidebar event={event} />}
        {event?._type === "repeatingHappening" && <RepeatingHappeningSidebar event={event} />}

        <div>
          <article>
            <Heading className="mb-4">{event.title}</Heading>

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
      </Container>
    </div>
  );
};
