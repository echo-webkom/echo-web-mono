import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { isFuture, isPast } from "date-fns";
import { RxArrowRight as ArrowRight, RxExternalLink as ExternalLink } from "react-icons/rx";

import { urlFor } from "@echo-webkom/sanity";

import { AddToCalender } from "@/components/add-to-calender";
import { Countdown } from "@/components/countdown";
import { DeregisterButton } from "@/components/deregister-button";
import { RegisterButton } from "@/components/register-button";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { Button } from "@/components/ui/button";
import { getQuestionsByHappeningId } from "@/data/questions/queries";
import { getRegistrationsByHappeningId } from "@/data/registrations/queries";
import { getSpotRangeByHappeningId } from "@/data/spotrange/queries";
import { getUser } from "@/lib/get-user";
import { isHost } from "@/lib/memberships";
import { type fetchHappeningBySlug } from "@/sanity/happening";
import { cn } from "@/utils/cn";
import {
  isBetween,
  isSameDate,
  norwegianDateString,
  shortDateNoTime,
  shortDateNoYear,
  timeWithEndTime,
} from "@/utils/date";
import { doesIntersect } from "@/utils/list";
import { mailTo } from "@/utils/prefixes";
import { ReactionButtonGroup } from "../reaction-button-group";
import { RegistrationCount } from "../registration-count";
import { RegistrationsPreview } from "./registrations-preview";

type EventSidebarProps = {
  event: Exclude<Awaited<ReturnType<typeof fetchHappeningBySlug>>, null>;
};

export const HappeningSidebar = async ({ event }: EventSidebarProps) => {
  // Opt-out of caching
  noStore();

  const [user, spotRanges, registrations, questions] = await Promise.all([
    getUser(),
    getSpotRangeByHappeningId(event._id),
    getRegistrationsByHappeningId(event._id),
    getQuestionsByHappeningId(event._id),
  ]);

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

  const isNormalRegistrationOpen = Boolean(
    event?.registrationStart &&
      event?.registrationEnd &&
      isBetween(event.registrationStart, event.registrationEnd),
  );

  const isGroupRegistrationOpen = Boolean(
    event?.registrationStartGroups &&
      event?.registrationEnd &&
      isBetween(event.registrationStartGroups, event.registrationEnd),
  );

  const hostGroups = event?.organizers?.map((organizer) => organizer.slug) ?? [];
  const isHosting = user && event ? isHost(user, hostGroups) : false;

  const isUserComplete = user?.degreeId && user.year && user.hasReadTerms;

  const canEarlyRegister = Boolean(
    user &&
      event &&
      doesIntersect(
        event.registrationGroups ?? [],
        user.memberships.map((membership) => membership.group.id),
      ),
  );

  const isRegistrationOpen = canEarlyRegister ? isGroupRegistrationOpen : isNormalRegistrationOpen;
  const userRegistrationStart = canEarlyRegister
    ? event?.registrationStartGroups
    : event?.registrationStart;

  const isClosed = Boolean(event?.registrationEnd && isPast(event.registrationEnd));

  const registrationOpensIn24Hours =
    userRegistrationStart &&
    isPast(new Date(new Date(userRegistrationStart).getTime() - 24 * 60 * 60 * 1000));

  const currentUserStatus = registrations.find(
    (registration) => registration.userId === user?.id,
  )?.status;

  const userWaitlistPosition =
    registrations
      .filter((registration) => {
        return registration.status === "waiting";
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .findIndex((registration) => registration.userId === user?.id) + 1;

  const isBanned = user?.banInfo
    ? isFuture(new Date(user.banInfo.expiresAt)) && event.happeningType === "bedpres"
    : false;

  const hideRegistrations = (event.hideRegistrations ?? false) === true;

  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-4 lg:max-w-[320px]">
      {/**
       * Show warning if:
       * - Event is not happening
       * - Event is not external
       */}
      {event.happeningType !== "external" ||
        (!event && (
          <Callout type="warning" noIcon>
            <p className="font-semibold">Fant ikke arrangementet.</p>
            <p>Kontakt Webkom!</p>
          </Callout>
        ))}

      {/**
       * Show warning closed happening warning if:
       * - User is logged in
       * - Registration is closed
       */}
      {user && isClosed && (
        <Callout type="warning" noIcon>
          <p className="font-semibold">Påmelding er stengt.</p>
        </Callout>
      )}

      {/**
       * Show banned warning if:
       * - User is logged in
       * - User is banned
       * - User is complete
       */}
      {isBanned && (
        <Callout type="warning" noIcon>
          <p className="font-semibold">
            Du er utestengt fra bedriftspresentasjoner frem til{" "}
            {shortDateNoTime(user!.banInfo.expiresAt)}.
          </p>
        </Callout>
      )}

      {/**
       * Show warning for not being in group if:
       * - User is logged in
       * - User is not in any of the groups that can early register
       * - Normal registration is not open.
       * - Registration is not closed
       */}
      {user &&
        !canEarlyRegister &&
        event?.registrationStartGroups &&
        !isNormalRegistrationOpen &&
        !isClosed && (
          <Callout type="warning" noIcon>
            {event?.registrationStart ? (
              <p className="font-semibold">Du kan ikke melde deg på enda.</p>
            ) : (
              <p className="font-semibold">Kun medlemmer av inviterte grupper kan melde seg på.</p>
            )}
          </Callout>
        )}

      {/**
       * Show login warning if:
       * - User is not logged in
       * - Registration start is set
       */}
      {!user && event?.registrationStart && !isClosed && (
        <Callout type="warning" noIcon>
          <p className="mb-3 font-semibold">Du må logge inn for å melde deg på.</p>
          <div className="group flex items-center">
            <Link href="/auth/logg-inn" className="hover:underline">
              Logg inn her
              <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </Callout>
      )}

      {/**
       * Show uncomplete user warning if:
       * - User is logged in
       * - User has not completed profile
       */}
      {user && !isUserComplete && (
        <Callout type="warning" noIcon>
          <p className="mb-3 font-semibold">
            Du må fylle ut brukeren din og akkseptere de etiske retningslinjene for å melde deg på.
          </p>
          <div className="group flex items-center">
            <Link href="/auth/profil" className="hover:underline">
              Klikk her for å fullføre
              <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </Callout>
      )}

      <Sidebar
        className={cn("grid grid-cols-1", {
          "gap-8 sm:grid-cols-2 lg:grid-cols-1": Boolean(event.company?.image),
        })}
      >
        {/**
         * Show company logo if:
         * - There is a company
         */}
        {event.company && (
          <SidebarItem>
            <a href={event.company.website}>
              <Image
                src={urlFor(event.company.image).url()}
                alt={`${event.company.name} logo`}
                width={700}
                height={475}
                className="h-auto w-full"
              />
            </a>
          </SidebarItem>
        )}

        <div className="flex flex-col gap-2">
          {event.company && (
            <SidebarItem>
              <SidebarItemTitle>Bedrift:</SidebarItemTitle>
              <SidebarItemContent>
                <a className="hover:underline" href={event.company.website}>
                  {event.company.name}
                  <ExternalLink className="ml-1 inline-block h-4 w-4" />
                </a>
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
                <AddToCalender
                  date={new Date(event.date)}
                  endDate={event.endDate ? new Date(event.endDate) : undefined}
                  title={event.title}
                >
                  {shortDateNoTime(event.date)}{" "}
                  <ExternalLink className="ml-1 inline-block h-4 w-4" />
                </AddToCalender>
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
              <SidebarItemContent>
                {timeWithEndTime(event.date, event.endDate ?? undefined)}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {event.endDate && !isSameDate(event.date, event.endDate) && (
            <SidebarItem>
              <SidebarItemTitle>Slutt:</SidebarItemTitle>
              <SidebarItemContent>{shortDateNoYear(event.endDate)}</SidebarItemContent>
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
                    <span> {range.minYear === 6 ? "5+." : range.minYear + "."} trinn</span>
                  ) : (
                    <span>
                      {" "}
                      {range.minYear} - {range.maxYear === 6 ? "5+." : range.maxYear + "."} trinn
                    </span>
                  )}
                </SidebarItemContent>
              ))}
            </SidebarItem>
          )}

          {/**
           * Show registered count if:
           * - People can reigster
           */}
          {spotRanges.length > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldte:</SidebarItemTitle>
              <SidebarItemContent>
                <RegistrationCount registeredCount={registeredCount} maxCapacity={maxCapacity} />
              </SidebarItemContent>
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
                      <a className="hover:underline" href={mailTo(contact.email)}>
                        {contact.profile.name}{" "}
                        <ExternalLink className="ml-1 inline-block h-4 w-4" />
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
           * Show waitlist position if:
           * - User is on waitlist
           */}
          {isRegistrationOpen && currentUserStatus === "waiting" && userWaitlistPosition > 0 && (
            <SidebarItem>
              <SidebarItemTitle>Plass på venteliste:</SidebarItemTitle>
              <SidebarItemContent>{userWaitlistPosition}</SidebarItemContent>
            </SidebarItem>
          )}

          {/**
           * Show registration end date if:
           * - Registration is open
           * - Registration end date is set
           */}
          {isRegistrationOpen && event?.registrationEnd && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
              <SidebarItemContent>
                {new Date(event.registrationEnd).toLocaleDateString("nb-NO")}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {/**
           * Show registration start date if:
           * - Registration is not open
           * - Registration start date is set
           * - Registration is not closed
           */}
          {!isNormalRegistrationOpen && event?.registrationStart && !isClosed && (
            <SidebarItem>
              <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
              <SidebarItemContent>
                {norwegianDateString(event?.registrationStart)}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {/**
           * Show registration start date for groups if:
           * - Registration is not open
           * - Can early register
           * - Registration start date for groups is set
           * - Registration is not closed
           */}
          {!isNormalRegistrationOpen &&
            canEarlyRegister &&
            !isGroupRegistrationOpen &&
            event?.registrationStartGroups &&
            !isClosed && (
              <SidebarItem>
                <SidebarItemTitle>Påmelding for grupper åpner:</SidebarItemTitle>
                <SidebarItemContent>
                  {norwegianDateString(event.registrationStartGroups)}
                </SidebarItemContent>
              </SidebarItem>
            )}

          {/**
           * Show deregister button if:
           * - User is registered to happening
           * - Happening has not passed
           */}
          {isRegistered && currentUserStatus && event?.date && isFuture(new Date(event.date)) && (
            <SidebarItem>
              <DeregisterButton id={event._id}>
                Meld av
                {currentUserStatus === "waiting" ? " venteliste" : ""}
              </DeregisterButton>
            </SidebarItem>
          )}
          {/**
           * Show registration button if:
           * - User is logged in
           * - User has completed profile
           * - User is not banned
           * - There is a spot range (you can register to this event)
           * - Registration is open
           * - Registration is not closed
           * - Registration opens in 24 hours
           */}
          {!isRegistered &&
            isUserComplete &&
            spotRanges.length > 0 &&
            !isBanned &&
            !isClosed &&
            registrationOpensIn24Hours && (
              <SidebarItem className="relative">
                <RegisterButton
                  id={event._id}
                  questions={questions}
                  registrationDate={new Date(userRegistrationStart)}
                />
              </SidebarItem>
            )}

          {event.externalLink && (
            <SidebarItem>
              <Button asChild fullWidth>
                <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                  Til påmelding
                </a>
              </Button>
            </SidebarItem>
          )}
        </div>
      </Sidebar>

      {Boolean(user) && !hideRegistrations && (
        <RegistrationsPreview
          registrations={registrations.map((registration) => ({
            image: registration.user.image,
            name: registration.user.name,
            userId: registration.userId,
            status: registration.status,
          }))}
        />
      )}

      {/**
       * Show link to admin dashbord if:
       * - User is host
       * - The happening is not external
       */}
      {isHosting && event.happeningType !== "external" && (
        <Button variant="link" className="w-full" asChild>
          <Link href={`/dashbord/${event.slug}`}>Admin dashbord</Link>
        </Button>
      )}
      {/**
       * Show reaction buttons if:
       * - User is logged in
       */}
      {Boolean(user) && <ReactionButtonGroup reactToKey={event._id} />}
    </div>
  );
};
