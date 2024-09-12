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
import { getHappeningById } from "@/data/happenings/queries";
import { getRegistrationsByHappeningId } from "@/data/registrations/queries";
import { getSpotRangeByHappeningId } from "@/data/spotrange/queries";
import { isUserBannedFromBedpres } from "@/lib/ban-info";
import { getUser } from "@/lib/get-user";
import { isHost as _isHost } from "@/lib/memberships";
import { type AllHappeningsQueryResult } from "@/sanity.types";
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
import { ReactionButtonGroup } from "./reaction-button-group";
import { RegistrationCount } from "./registration-count";

type EventSidebarProps = {
  event: AllHappeningsQueryResult[number];
};

export const HappeningSidebar = async ({ event }: EventSidebarProps) => {
  // Opt-out of caching
  noStore();

  const [user, happening, spotRanges, registrations] = await Promise.all([
    getUser(),
    getHappeningById(event._id),
    getSpotRangeByHappeningId(event._id),
    getRegistrationsByHappeningId(event._id),
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
    happening?.registrationStart &&
      happening?.registrationEnd &&
      isBetween(happening.registrationStart, happening.registrationEnd),
  );

  const isGroupRegistrationOpen = Boolean(
    happening?.registrationStartGroups &&
      happening?.registrationEnd &&
      isBetween(happening.registrationStartGroups, happening.registrationEnd),
  );

  const isHost = user && happening ? _isHost(user, happening) : false;

  const isUserComplete = user?.degreeId && user.year && user.hasReadTerms;

  const canEarlyRegister = Boolean(
    user &&
      happening &&
      doesIntersect(
        happening.registrationGroups ?? [],
        user.memberships.map((membership) => membership.group.id),
      ),
  );

  const isRegistrationOpen = canEarlyRegister ? isGroupRegistrationOpen : isNormalRegistrationOpen;
  const userRegistrationStart = canEarlyRegister
    ? happening?.registrationStartGroups
    : happening?.registrationStart;

  const isClosed = Boolean(
    happening?.registrationEnd && isPast(new Date(happening.registrationEnd)),
  );

  const isBannedFromBedpres =
    happening && user && happening.type === "bedpres" && user.isBanned
      ? await isUserBannedFromBedpres(user, happening)
      : false;

  const registrationOpensIn24Hours =
    userRegistrationStart &&
    isPast(new Date(userRegistrationStart?.getTime() - 24 * 60 * 60 * 1000));

  const currentUserStatus = registrations.find(
    (registration) => registration.userId === user?.id,
  )?.status;

  return (
    <div className="flex w-full flex-col gap-4 lg:max-w-[320px]">
      {/**
       * Show warning if:
       * - Event is not happening
       * - Event is not external
       */}
      {!happening && event.happeningType !== "external" && (
        <Callout type="warning" noIcon>
          <p className="font-semibold">Fant ikke arrangementet.</p>
          <p>Kontakt Webkom!</p>
        </Callout>
      )}

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
      {user && isBannedFromBedpres && isUserComplete && (
        <Callout type="warning" noIcon>
          <p className="font-semibold">Du er utestengt fra denne bedriftspresentasjonen.</p>
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
        happening?.registrationStartGroups &&
        !isNormalRegistrationOpen &&
        !isClosed && (
          <Callout type="warning" noIcon>
            {happening?.registrationStart ? (
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
      {!user && happening?.registrationStart && !isClosed && (
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
            <Link href={event.company.website}>
              <Image
                src={urlFor(event.company.image).url()}
                alt={`${event.company.name} logo`}
                width={700}
                height={475}
                className="h-auto w-full"
              />
            </Link>
          </SidebarItem>
        )}

        <div className="flex flex-col gap-2">
          {event.company && (
            <SidebarItem>
              <SidebarItemTitle>Bedrift:</SidebarItemTitle>
              <SidebarItemContent>
                <Link className="hover:underline" href={event.company.website}>
                  {event.company.name}
                  <ExternalLink className="ml-1 inline-block h-4 w-4" />
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
           * Show registration end date if:
           * - Registration is open
           * - Registration end date is set
           */}
          {isRegistrationOpen && happening?.registrationEnd && (
            <SidebarItem>
              <SidebarItemTitle>Påmeldingsfrist:</SidebarItemTitle>
              <SidebarItemContent>
                {happening.registrationEnd.toLocaleDateString("nb-NO")}
              </SidebarItemContent>
            </SidebarItem>
          )}

          {/**
           * Show registration start date if:
           * - Registration is not open
           * - Registration start date is set
           * - Registration is not closed
           */}
          {!isNormalRegistrationOpen && happening?.registrationStart && !isClosed && (
            <SidebarItem>
              <SidebarItemTitle>Påmelding åpner:</SidebarItemTitle>
              <SidebarItemContent>
                {norwegianDateString(happening?.registrationStart)}
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
            happening?.registrationStartGroups &&
            !isClosed && (
              <SidebarItem>
                <SidebarItemTitle>Påmelding for grupper åpner:</SidebarItemTitle>
                <SidebarItemContent>
                  {norwegianDateString(happening.registrationStartGroups)}
                </SidebarItemContent>
              </SidebarItem>
            )}

          {/**
           * Show deregister button if:
           * - User is registered to happening
           * - Happening has not passed
           */}
          {isRegistered &&
            currentUserStatus &&
            happening?.date &&
            isFuture(new Date(happening.date)) && (
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
            !isBannedFromBedpres &&
            spotRanges.length > 0 &&
            !isClosed &&
            registrationOpensIn24Hours && (
              <SidebarItem className="relative">
                <RegisterButton id={event._id} questions={happening?.questions ?? []} />
                <Countdown toDate={userRegistrationStart} />
              </SidebarItem>
            )}
        </div>
      </Sidebar>
      {/**
       * Show link to admin dashbord if:
       * - User is host
       */}
      {isHost && (
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
