import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { and, eq } from "drizzle-orm";

import { yearToNumber } from "@echo-webkom/lib";
import { db, getHappening, getSpotRangeByHappening } from "@echo-webkom/storage";

import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { getJwtPayload } from "@/lib/session";
import { type Event } from "@/sanity/event";

type EventSidebarProps = {
  slug: string;
  event: Event;
};

export async function EventSidebar({ slug, event }: EventSidebarProps) {
  // TODO:
  // Get user
  // Check if user is organizer
  // Check if user is admin
  // Check if user is registered
  // Get spot ranges
  // Check if registration is open

  const jwt = await getJwtPayload();
  const happening = await getHappening(slug);
  const spotRanges = await getSpotRangeByHappening(slug);

  const isRegistered =
    jwt &&
    !!(await db.query.registrations.findFirst({
      where: (r) =>
        and(eq(r.happeningSlug, slug), eq(r.userId, jwt?.sub), eq(r.status, "registered")),
    }));

  const isRegistrationOpen =
    happening?.registrationStart &&
    happening.registrationStart < new Date() &&
    (!happening.registrationEnd || happening.registrationEnd > new Date());

  return (
    <Sidebar>
      {!happening && (
        <SidebarItem>
          <div className="border-l-4 border-red-500 bg-red-200 p-4 text-red-700">
            <p className="font-semibold">Fant ikke arrangementet.</p>
          </div>
        </SidebarItem>
      )}

      {happening?.date && (
        <SidebarItem>
          <SidebarItemTitle>Dato:</SidebarItemTitle>
          <SidebarItemContent>
            <AddToCalender date={eventInfo?.date} title={eventInfo?.title} />
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

      {happening.spotRanges && happening.spotRanges.length > 0 && (
        <SidebarItem>
          <SidebarItemTitle>Plasser:</SidebarItemTitle>
          {spotRanges.map((sr) => (
            <SidebarItemContent key={`${sr.minYear}${sr.maxYear}`}>
              idk / {sr.spots} for
              {sr.minYear === sr.maxYear ? (
                <span> {yearToNumber(sr.minYear)}. trinn</span>
              ) : (
                <span>
                  {" "}
                  {yearToNumber(sr.minYear)} - {yearToNumber(sr.maxYear)}. trinn
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

      {/* {eventInfo &&
        waitlistCount &&
        eventInfo.registrationStart &&
        eventInfo.registrationStart < new Date() &&
        waitlistCount > 0 && (
          <SidebarItem>
            <SidebarItemTitle>Venteliste:</SidebarItemTitle>
            <SidebarItemContent>{waitlistCount}</SidebarItemContent>
          </SidebarItem>
        )} */}

      {isRegistrationOpen && happening?.registrationEnd && (
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

      {jwt && isRegistrationOpen && happening?.questions && (
        <SidebarItem>
          {isRegistered ? (
            <DeregisterButton slug={slug} />
          ) : (
            <RegisterButton slug={slug} questions={happening.questions} />
          )}
        </SidebarItem>
      )}

      {jwt && !isRegistrationOpen && (
        <SidebarItem>
          <div className="border-l-4 border-yellow-500 bg-wave p-4 text-yellow-700">
            <p className="font-semibold">Påmelding er stengt.</p>
          </div>
        </SidebarItem>
      )}

      {!jwt && (
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

      {/* {(isAdmin || isOrganizer) && (
        <SidebarItem>
          <Button fullWidth variant="link" asChild>
            <Link href={"/dashboard/" + slug}>Til Dashboard</Link>
          </Button>
        </SidebarItem>
      )} */}
    </Sidebar>
  );
}
