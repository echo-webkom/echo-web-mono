import Link from "next/link";

import {prisma} from "@echo-webkom/db/client";

import Container from "@/components/container";
import Markdown from "@/components/markdown";
import {Button} from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {getServerSession} from "@/lib/session";
import {fetchEventBySlug} from "@/sanity/event";
import DeregisterButton from "./deregister-button";
import RegisterButton from "./register-button";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({params}: Props) {
  const event = await fetchEventBySlug(params.slug);

  return {
    title: event.title,
  };
}

export default async function EventPage({params}: Props) {
  const session = await getServerSession();
  const event = await fetchEventBySlug(params.slug);
  const eventInfo = await prisma.happening.findUnique({
    where: {
      slug: params.slug,
    },
  });

  let isRegistered: boolean;
  if (session) {
    const registration = await prisma.registration.findUnique({
      where: {
        userId_happeningSlug: {
          happeningSlug: params.slug,
          userId: session.user.id,
        },
      },
    });
    isRegistered = Boolean(registration?.status === "REGISTERED");
  } else {
    isRegistered = false;
  }

  const [registeredCount, waitlistCount] = await prisma.$transaction([
    prisma.registration.count({
      where: {
        happeningSlug: params.slug,
        status: "REGISTERED",
      },
    }),
    prisma.registration.count({
      where: {
        happeningSlug: params.slug,
        status: "WAITLISTED",
      },
    }),
  ]);

  const maxCapacity = (
    await prisma.spotRange.findMany({
      where: {
        happeningSlug: params.slug,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);

  return (
    <Container className="w-full md:max-w-[800px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="flex h-full w-full flex-col gap-3 lg:max-w-[250px]">
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
              <p className="font-semibold">Arrangert av:</p>
              <ul>
                {event.organizers.map((organizer) => (
                  <li key={organizer._id}>{organizer.name}</li>
                ))}
              </ul>
            </div>
          )}

          {event.contacts && event.contacts.length > 0 && (
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

          {eventInfo?.registrationStart && eventInfo.registrationStart < new Date() && (
            <div>
              <p className="font-semibold">Påmeldte:</p>
              <p>
                {registeredCount} / {maxCapacity}
              </p>
            </div>
          )}

          {eventInfo?.registrationStart &&
            eventInfo.registrationStart < new Date() &&
            waitlistCount > 0 && (
              <div>
                <p className="font-semibold">Venteliste:</p>
                <p>{waitlistCount}</p>
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

          {session && eventInfo?.registrationStart && eventInfo.registrationStart < new Date() && (
            <div>
              {isRegistered ? (
                <DeregisterButton slug={params.slug} />
              ) : (
                <>
                  <RegisterButton slug={params.slug} />
                </>
              )}
            </div>
          )}

          {!session && (
            <div>
              <p>Du må være logget inn for å melde deg på</p>
            </div>
          )}

          {session?.user.role === "ADMIN" && (
            <div>
              <Button fullWidth variant="secondary" asChild>
                <Link href={"/event/" + params.slug + "/dashboard"}>Til Dashboard</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <article>
          <Heading>{event.title}</Heading>
          <Markdown content={event.body ?? "## Mer informasjon kommer!"} />
        </article>
      </div>

      <div className="flex flex-col gap-3 pt-10 text-center text-sm text-muted-foreground lg:mt-auto">
        <p>Publisert: {new Date(event._createdAt).toLocaleDateString()}</p>
        <p>Sist oppdatert: {new Date(event._updatedAt).toLocaleDateString()}</p>
      </div>
    </Container>
  );
}
