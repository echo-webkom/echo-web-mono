import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { isFuture, isPast } from "date-fns";
import { eq } from "drizzle-orm";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { AddToCalender } from "@/components/add-to-calender";
import { Countdown } from "@/components/countdown";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { Button } from "@/components/ui/button";
import { isHost as _isHost } from "@/lib/is-host";
import { type Happening } from "@/sanity/happening/schemas";
import { norwegianDateString, time } from "@/utils/date";
import { urlFor } from "@/utils/image-builder";

type EventSidebarProps = {
  event: Happening;
};

export async function HappeningSidebar({ event }: EventSidebarProps) {
  const user = await auth();

  const happening = await db.query.happenings
    .findFirst({
      where: (happening) => eq(happening.id, event._id),
      with: {
        questions: true,
        groups: {
          with: {
            group: true,
          },
        },
      },
    })
    .catch(() => null);
  const spotRanges = await db.query.spotRanges
    .findMany({
      where: (spotRange) => eq(spotRange.happeningId, event._id),
    })
    .catch(() => []);
  const registrations = await db.query.registrations
    .findMany({
      where: (registration) => eq(registration.happeningId, event._id),
      with: {
        user: true,
      },
    })
    .catch(() => []);

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

  const hasRegistration = happening?.registrationStart && happening?.registrationEnd;

  // Must use "!" because of the check above
  const isRegistrationOpen =
    hasRegistration && isPast(happening.registrationStart!) && isFuture(happening.registrationEnd!);

  const isHost = user && happening ? _isHost(user, happening) : false;

  const isUserComplete = user?.degreeId && user.year;

  return (
    <Sidebar>
      {/**
       * Show warning if:
       * - Event is not happening
       * - Event is not external
       */}
      {!happening && event.happeningType !== "external" && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </Callout>
        </SidebarItem>
      )}

      {/**
       * Show company logo if:
       * - There is a company
       */}
      {event.company && (
        <SidebarItem>
          <Link href={event.company.website}>
            <div className="overflow-hidden">
              <div className="relative aspect-square w-full">
                <Image
                  src={urlFor(event.company.image).url()}
                  alt={`${event.company.name} logo`}
                  fill
                />
              </div>
            </div>
          </Link>
        </SidebarItem>
      )}

      {event.company && (
        <SidebarItem>
          <SidebarItemTitle>Bedrift:</SidebarItemTitle>
          <SidebarItemContent>
            <Link className="hover:underline" href={event.company.website}>
              {event.company.name}
              <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />
            </Link>
          </SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show date if:
       * - There is a date set
       */}
      {event.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>
            <AddToCalender date={new Date(event.date)} title={event.title} />
          </SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show time if:
       * - There is a date set
       */}
      {event.date && (
        <SidebarItem>
          <SidebarItemTitle>Klokkeslett:</SidebarItemTitle>
          <SidebarItemContent>{time(event.date)}</SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show spot ranges if:
       * - There are spot ranges
       */}
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

      {/**
       * Show location if:
       * - There is a location set
       */}
      {event.location && (
        <SidebarItem>
          <SidebarItemTitle>Sted:</SidebarItemTitle>
          <SidebarItemContent>{event.location.name}</SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show hosts if:
       * - There are hosts
       */}
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

      {/**
       * Show deductable if:
       * - There is a deductable
       */}
      {Boolean(event.cost) && (
        <SidebarItem>
          <SidebarItemTitle>Pris:</SidebarItemTitle>
          <SidebarItemContent>{event.cost} kr</SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show registered count if:
       * - Registration is open
       * - People are registered
       */}
      {isRegistrationOpen && spotRanges.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
          <SidebarItemContent>
            {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show waitlist count if:
       * - Registration is open
       * - There is a waitlist
       */}
      {isRegistrationOpen && waitlistCount > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Venteliste:</SidebarItemTitle>
          <SidebarItemContent>{waitlistCount}</SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show registration end date if:
       * - Registration is open
       * - Registration end date is set
       */}
      {isRegistrationOpen && happening.registrationEnd && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.registrationEnd.toLocaleDateString("nb-NO")}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show registration start date if:
       * - Registration is not open
       * - Registration start date is set
       */}
      {!isRegistrationOpen && happening?.registrationStart && (
        <SidebarItem>
          <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
          <SidebarItemContent>
            {norwegianDateString(happening?.registrationStart)}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {/**
       * Show deregister button if:
       * - User is registered to happening
       */}
      {isRegistered && (
        <SidebarItem>
          <DeregisterButton id={event._id} />
        </SidebarItem>
      )}

      {/**
       * Show registration button if:
       * - User is logged in
       * - User has completed profile
       * - There is a spot range (you can register to this event)
       * - Registration is open
       * - Registration is not closed
       */}
      {!isRegistered &&
        isUserComplete &&
        spotRanges.length > 0 &&
        happening?.registrationStart &&
        (happening.registrationEnd ? isFuture(new Date(happening.registrationEnd)) : true) &&
        isPast(new Date(happening.registrationStart.getTime() - 24 * 60 * 60 * 1000)) && (
          <SidebarItem className="relative">
            <RegisterButton id={event._id} questions={happening.questions} />
            <Countdown toDate={happening.registrationStart} />
          </SidebarItem>
        )}

      {/**
       * Show warning closed happening warning if:
       * - User is logged in
       * - Registration is closed
       */}
      {user && !isRegistrationOpen && hasRegistration && (
        <SidebarItem>
          <Callout type="warning" noIcon>
            <p className="font-semibold">Påmelding er stengt.</p>
          </Callout>
        </SidebarItem>
      )}

      {/**
       * Show uncomplete user warning if:
       * - User is logged in
       * - User has not completed profile
       */}
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

      {/**
       * Show login warning if:
       * - User is not logged in
       * - Registration start is set
       */}
      {!user && happening?.registrationStart && (
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

      {/**
       * Show link to admin dashbord if:
       * - User is host
       */}
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
