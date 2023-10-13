import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";

import { prisma } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { DeregisterButton } from "@/components/deregister-button";
import { Markdown } from "@/components/markdown";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { isEventOrganizer } from "@/lib/happening";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { getUser } from "@/lib/session";
import { fetchEventBySlug } from "@/sanity/event";

type Props = {
  params: {
    slug: string;
  };
};

async function getData(slug: string) {
  const data = await fetchEventBySlug(slug);
  const info = await getHappeningBySlug(slug);

  if (!data || !info) {
    return notFound();
  }

  return {
    data,
    info,
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;

  const event = await getData(slug);

  return {
    title: event.data.title,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = params;

  // RENAME VARIABLES
  const { data: event, info: eventInfo } = await getData(slug);

  const user = await getUser();

  const isOrganizer = user && isEventOrganizer(user, eventInfo);
  const isAdmin = user?.role === "ADMIN";

  const spotRange = await prisma.spotRange.findMany({
    where: {
      happeningSlug: slug,
    },
  });

  const isRegistered = user
    ? (
        await prisma.registration.findUnique({
          where: {
            userId_happeningSlug: {
              happeningSlug: slug,
              userId: user.id,
            },
          },
        })
      )?.status === "REGISTERED"
    : false;

  const registrations = await prisma.registration.findMany({
    where: {
      happeningSlug: slug,
    },
  });

  const registeredCount = registrations.filter(
    (registration) => registration.status === "REGISTERED",
  ).length;
  const waitlistCount = registrations.filter(
    (registration) => registration.status === "WAITLISTED",
  ).length;

  const maxCapacity = (
    await prisma.spotRange.findMany({
      where: {
        happeningSlug: slug,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);

  const isRegistrationOpen =
    eventInfo?.registrationStart &&
    eventInfo?.registrationEnd &&
    isAfter(new Date(), eventInfo.registrationStart) &&
    isBefore(new Date(), eventInfo.registrationEnd);

  return (
    <Container className="w-full md:max-w-[700px] lg:max-w-[1500px]">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <Sidebar>
          {eventInfo.date && (
            <SidebarItem>
              <SidebarItemTitle>Dato:</SidebarItemTitle>
              <SidebarItemContent>{eventInfo?.date.toLocaleDateString("nb-NO")}</SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo.date && (
            <SidebarItem>
              <SidebarItemTitle>Tid:</SidebarItemTitle>
              <SidebarItemContent>
                {eventInfo?.date.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {spotRange.length > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Plasser:</SidebarItemTitle>
              {spotRange.map((range) => (
                <SidebarItemContent key={range.id}>
                  {range.spots} plasser for
                  {range.minDegreeYear === range.maxDegreeYear ? (
                    <span> {range.minDegreeYear}. trinn</span>
                  ) : (
                    <span>
                      {" "}
                      {range.minDegreeYear} - {range.maxDegreeYear}. trinn
                    </span>
                  )}
                </SidebarItemContent>
              ))}
            </SidebarItem>
          )}

          {event.location && (
            <SidebarItem>
              <SidebarItemTitle className="font-semibold">Sted:</SidebarItemTitle>
              <SidebarItemContent>{event.location.name}</SidebarItemContent>
            </SidebarItem>
          )}

          {event.organizers && (
            <SidebarItem>
              <SidebarItemTitle>Arrangert av:</SidebarItemTitle>
              <SidebarItemContent>
                <ul>
                  {event.organizers.map((organizer) => (
                    <li key={organizer._id}>{organizer.name}</li>
                  ))}
                </ul>
              </SidebarItemContent>
            </SidebarItem>
          )}

          {event.contacts && event.contacts.length > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Kontaktpersoner:</SidebarItemTitle>
              <SidebarItemContent>
                <ul>
                  {event.contacts.map((contact) => (
                    <li key={contact.profile._id}>
                      <a className="hover:underline" href={"mailto:" + contact.email}>
                        {contact.profile.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo?.registrationStart && eventInfo.registrationStart < new Date() && (
            <SidebarItem>
              <SidebarItemTitle className="font-semibold">Påmeldte:</SidebarItemTitle>
              <SidebarItemContent>
                {registeredCount} / {maxCapacity}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {eventInfo?.registrationStart &&
            eventInfo.registrationStart < new Date() &&
            waitlistCount > 0 && (
              <SidebarItem>
                <SidebarItemTitle>Venteliste:</SidebarItemTitle>
                <SidebarItemContent>{waitlistCount}</SidebarItemContent>
              </SidebarItem>
            )}

          {isRegistrationOpen && eventInfo?.registrationEnd && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
              <SidebarItemContent>
                {eventInfo?.registrationEnd.toLocaleDateString("nb-NO")}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {!isRegistrationOpen &&
            eventInfo?.registrationStart &&
            new Date() < eventInfo.registrationStart && (
              <SidebarItem>
                <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
                <SidebarItemContent>
                  {eventInfo?.registrationStart.toLocaleDateString("nb-NO")}
                </SidebarItemContent>
              </SidebarItem>
            )}

          {user && isRegistrationOpen && (
            <SidebarItem>
              {isRegistered ? (
                <DeregisterButton slug={params.slug} />
              ) : (
                <RegisterButton slug={params.slug} questions={eventInfo.questions} />
              )}
            </SidebarItem>
          )}

          {user && !isRegistrationOpen && (
            <SidebarItem>
              <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
                <p className="font-semibold">Påmelding er stengt.</p>
              </div>
            </SidebarItem>
          )}

          {!user && (
            <SidebarItem>
              <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
                <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
                <div className="flex items-center">
                  <Link href="/api/auth/signin" className="hover:underline">
                    Logg inn her
                  </Link>
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </div>
            </SidebarItem>
          )}

          {(isAdmin || isOrganizer) && (
            <SidebarItem>
              <Button fullWidth variant="link" asChild>
                <Link href={"/dashboard/" + slug}>Til Dashboard</Link>
              </Button>
            </SidebarItem>
          )}
        </Sidebar>

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
