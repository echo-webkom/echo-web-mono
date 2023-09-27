import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { isAfter, isBefore } from "date-fns";

import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { getHappeningBySlug } from "@/lib/queries/happening";
import { getRegistrationBySlug, getRegistrationBySlugAndUserId } from "@/lib/queries/registration";
import { getSpotRangeBySlug } from "@/lib/queries/spot-range";
import { getUser } from "@/lib/session";
import { type Event } from "@/sanity/event";

type EventSidebarProps = {
  slug: string;
  event: Event;
};

export async function EventSidebar({ slug, event }: EventSidebarProps) {
  const user = await getUser();
  const { data: eventInfo } = await getHappeningBySlug(slug);

  const isOrganizer = user && eventInfo?.groups.some((group) => user.studentGroups.includes(group));
  const isAdmin = user?.role === "ADMIN";

  const { data: spotRange } = await getSpotRangeBySlug(slug);

  // Check if user is registered
  const registration = user ? await getRegistrationBySlugAndUserId(slug, user.id) : null;
  const isRegistered = registration?.data?.status === "REGISTERED";

  const { data: registrations } = await getRegistrationBySlug(slug);

  const registeredCount = registrations?.filter(
    (registration) => registration.status === "REGISTERED",
  ).length;
  const waitlistCount = registrations?.filter(
    (registration) => registration.status === "WAITLISTED",
  ).length;

  const maxCapacity = spotRange?.reduce((acc, curr) => acc + curr.spots, 0);

  const isRegistrationOpen =
    eventInfo?.registrationStart &&
    eventInfo?.registrationEnd &&
    isAfter(new Date(), eventInfo?.registrationStart) &&
    isBefore(new Date(), eventInfo?.registrationEnd);

  return (
    <Sidebar>
      {!eventInfo && (
        <SidebarItem>
          <div className="border-l-4 border-red-500 bg-red-200 p-4 text-red-700">
            <p className="font-semibold">Fant ikke arrangementet.</p>
          </div>
        </SidebarItem>
      )}

      {eventInfo?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>{eventInfo?.date.toLocaleDateString("nb-NO")}</SidebarItemContent>
        </SidebarItem>
      )}

      {eventInfo?.date && (
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

      {spotRange && spotRange.length > 0 && (
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

      {event.location?.name && (
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

      {eventInfo &&
        waitlistCount &&
        eventInfo.registrationStart &&
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

      {user && isRegistrationOpen && eventInfo?.questions && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={eventInfo.questions} />
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
  );
}
