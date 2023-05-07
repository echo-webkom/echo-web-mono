import Link from "next/link";

import {prisma} from "@echo-webkom/db/client";

import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {Button} from "@/components/ui/button";
import {getServerSession} from "@/lib/session";
import {fetchEventBySlug} from "@/sanity/event";

export default async function EventPage({params}: {params: {slug: string}}) {
  const session = await getServerSession();
  const event = await fetchEventBySlug(params.slug);
  const eventInfo = await prisma.happening.findUnique({
    where: {
      slug: params.slug,
    },
  });

  return (
    <Container>
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <div className="flex h-full w-full flex-col gap-3 md:max-w-[250px]">
          {eventInfo?.date && (
            <div>
              <p className="font-semibold">Dato:</p>
              <p>{eventInfo?.date.toLocaleDateString("nb-NO")}</p>
            </div>
          )}

          {eventInfo?.date && (
            <div>
              <p className="font-semibold">Tid:</p>
              <p>
                {eventInfo?.date.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {event.location && (
            <div>
              <p className="font-semibold">Sted:</p>
              <p>{event.location.name}</p>
            </div>
          )}

          {event.organizers && (
            <div>
              <p className="font-semibold">Arrangører:</p>
              <ul>
                {event.organizers.map((organizer) => (
                  <li key={organizer._id}>{organizer.name}</li>
                ))}
              </ul>
            </div>
          )}

          {event.contacts && (
            <div>
              <p className="font-semibold">Kontaktpersoner:</p>
              <ul>
                {event.contacts.map((contact) => (
                  <li key={contact.profile._id}>
                    <Link className="hover:underline" href={"mailto:" + contact.email}>
                      {contact.profile.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {eventInfo?.registrationStart &&
            eventInfo.registrationEnd &&
            eventInfo.registrationStart < new Date() &&
            new Date() < eventInfo.registrationEnd && (
              <div>
                <p className="font-semibold">Påmeldingsfrist:</p>
                <p>{eventInfo?.registrationEnd.toLocaleDateString("nb-NO")}</p>
              </div>
            )}

          {session ? (
            eventInfo?.date &&
            new Date() < eventInfo.date && (
              <div>
                <Button fullWidth>Meld på</Button>
              </div>
            )
          ) : (
            <div>
              <p>Du må være logget inn for å melde deg på</p>
            </div>
          )}
        </div>

        {/* Content */}
        <article>
          <h1 className="mb-5 text-4xl font-bold md:text-6xl">{event.title}</h1>
          <Markdown content={event.body ?? "## Mer informasjon kommer!"} />
        </article>
      </div>

      <div className="mt-16 flex flex-col gap-3 text-center text-sm text-muted-foreground md:mt-auto">
        <p>Publisert: {new Date(event._createdAt).toLocaleDateString()}</p>
        <p>Sist oppdatert: {new Date(event._updatedAt).toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
