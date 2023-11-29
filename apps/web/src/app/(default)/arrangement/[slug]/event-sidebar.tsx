import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";
import { eq } from "drizzle-orm";

import { getAuth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { AddToCalender } from "@/components/add-to-calender";
import { Countdown } from "@/components/countdown";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { Button } from "@/components/ui/button";
import { isHost as _isHost } from "@/lib/is-host";
import { type Event } from "@/sanity/event";
import { norwegianDateString } from "@/utils/date";

type EventSidebarProps = {
  event: Event;
};

export async function EventSidebar({ event }: EventSidebarProps) {
  const user = await getAuth();

  const happening = await db.query.happenings.findFirst({
    where: (happening) => eq(happening.id, event._id),
    with: {
      questions: true,
      groups: {
        with: {
          group: true,
        },
      },
    },
  });
  const spotRanges = await db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningId, event._id),
  });
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningId, event._id),
    with: {
      user: true,
    },
  });

  const isRegistered = registrations.some(
    (registration) =>
      registration.user.id === user?.id &&
      (registration.status === "registered" || registration.status === "waiting"),
  );

  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  const waitlistCount = registrations.filter(
    (registration) => registration.status === "waiting",
  ).length;

  const isRegistrationOpen =
    happening?.registrationStart &&
    happening?.registrationEnd &&
    isAfter(new Date(), happening.registrationStart) &&
    isBefore(new Date(), happening.registrationEnd);

  const isHost = user && happening ? _isHost(user, happening) : false;

  const isUserComplete = user?.degreeId && user.year;

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </Callout>
        </SidebarItem>
      )}

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>
            <AddToCalender date={happening?.date} title={happening?.title} />
          </SidebarItemContent>
        </SidebarItem>
      )}

      {spotRanges.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRanges.map((range) => (
            <SidebarItemContent key={range.id}>
              {range.spots || "Uendelig"} plasser for
              {range.minYear === range.maxYear ? (
                <span> {range.minYear}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {range.minYear} - {range.maxYear}. trinn
                </span>
              )}
            </SidebarItemContent>
          ))}
        </SidebarItem>
      )}

      {event.location && (
        <SidebarItem>
          <SidebarItemTitle>Sted:</SidebarItemTitle>
          <SidebarItemContent>{event.location.name}</SidebarItemContent>
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

      {happening?.registrationStart &&
        isAfter(new Date(), happening.registrationStart) &&
        spotRanges.length > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
            <SidebarItemContent>
              {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {happening?.registrationStart &&
        isAfter(new Date(), happening.registrationStart) &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )}

      {isRegistrationOpen && happening.registrationEnd && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.registrationEnd.toLocaleDateString("nb-NO")}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {!isRegistrationOpen &&
        happening?.registrationStart &&
        new Date() < happening.registrationStart && (
          <SidebarItem>
            <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
            <SidebarItemContent>
              {norwegianDateString(happening?.registrationStart)}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {isRegistered && (
        <SidebarItem>
          <DeregisterButton id={event._id} />
        </SidebarItem>
      )}

      {!isRegistered &&
        isUserComplete &&
        spotRanges.length > 0 &&
        happening?.registrationStart &&
        isAfter(
          new Date(),
          new Date(happening.registrationStart.getTime() - 24 * 60 * 60 * 1000),
        ) && (
          <SidebarItem className="relative">
            <RegisterButton id={event._id} questions={happening.questions} />
            <Countdown toDate={happening.registrationStart} />
          </SidebarItem>
        )}

      {user && happening?.registrationEnd && isAfter(new Date(), happening.registrationEnd) && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Påmelding er stengt.</p>
          </Callout>
        </SidebarItem>
      )}

      {user && !isUserComplete && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="mb-3 font-semibold">Du må fullføre brukeren din.</p>
            <div className="group flex items-center">
              <Link href="/auth/profil" className="hover:underline">
                Her
                <ArrowRightIcon className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </SidebarItem>
      )}

      {!user && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
            <div className="group flex items-center">
              <Link href="/auth/logg-inn" className="hover:underline">
                Logg inn her
                <ArrowRightIcon className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </Callout>
        </SidebarItem>
      )}

      {isHost && (
        <SidebarItem>
          <Button variant="link" className="w-full" asChild>
            <Link href={`/dashbord/${event.slug}`}>Admin dashbord</Link>
          </Button>
        </SidebarItem>
      )}
    </Sidebar>
  );
}
