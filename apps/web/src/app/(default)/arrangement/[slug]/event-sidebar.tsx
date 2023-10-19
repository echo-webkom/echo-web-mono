import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { AddToCalender } from "@/components/add-to-calender";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/session";
import { type Event } from "@/sanity/event";

type EventSidebarProps = {
  slug: string;
  event: Event;
};

export async function EventSidebar({ slug, event }: EventSidebarProps) {
  const user = await getUser();
  const happening = await db.query.happenings.findFirst({
    where: (happening) => eq(happening.slug, slug),
    with: {
      questions: true,
    },
  });
  const spotRange = await db.query.spotRanges.findMany({
    where: (spotRange) => eq(spotRange.happeningSlug, slug),
  });
  const registrations = await db.query.registrations.findMany({
    where: (registration) => eq(registration.happeningSlug, slug),
    with: {
      user: true,
    },
  });

  // TODO
  const isOrganizer = false;
  const isAdmin = false;

  const isRegistered = registrations.some((registration) => registration.user.id === user?.id);
  const maxCapacity = spotRange.reduce((acc, curr) => acc + (curr.spots ?? 0), 0);
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

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </div>
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

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Tid:</SidebarItemTitle>
          <SidebarItemContent>
            {happening?.date.toLocaleTimeString("nb-NO", {
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

      {happening?.registrationStart && isAfter(new Date(), happening.registrationStart) && (
        <SidebarItem>
          <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
          <SidebarItemContent>
            {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
          </SidebarItemContent>
        </SidebarItem>
      )}

      {happening?.registrationStart &&
        happening.registrationStart < new Date() &&
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
              {happening?.registrationStart.toLocaleDateString("nb-NO")}
            </SidebarItemContent>
          </SidebarItem>
        )}

      {user && isRegistrationOpen && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happening.questions} />
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
              <Link href="/api/auth/logg-inn" className="hover:underline">
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
            <Link href={"/dashbord/" + slug}>Til Dashboard</Link>
          </Button>
        </SidebarItem>
      )}
    </Sidebar>
  );
}
