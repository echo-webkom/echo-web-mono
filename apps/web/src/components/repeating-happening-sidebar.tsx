import { eachDayOfInterval } from "date-fns";
import { RxExternalLink as ExternalLink } from "react-icons/rx";

import { auth } from "@/auth/session";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { Button } from "@/components/ui/button";
import { type fetchRepeatingHappening } from "@/sanity/repeating-happening";
import { getDate } from "@/utils/date";
import { mailTo } from "@/utils/prefixes";
import { capitalize } from "@/utils/string";
import { ReactionButtonGroup } from "./reaction-button-group";

const DAYS = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

type EventSidebarProps = {
  event: Exclude<Awaited<ReturnType<typeof fetchRepeatingHappening>>, null>;
};

const intervalToText = (interval: "bi-weekly" | "monthly" | "weekly") => {
  switch (interval) {
    case "bi-weekly":
      return "Hver andre uke";
    case "monthly":
      return "Hver måned";
    case "weekly":
      return "Hver uke";
  }
};

const getNextOccurrence = (
  happening: Exclude<Awaited<ReturnType<typeof fetchRepeatingHappening>>, null>,
) => {
  return eachDayOfInterval({
    start: new Date(happening.startDate),
    end: new Date(happening.endDate),
  })
    .filter((date) => !happening.ignoredDates?.map(getDate).includes(getDate(date)))
    .filter((date) => date.getDay() === happening.dayOfWeek)
    .filter((_, i) => {
      switch (happening.interval) {
        case "weekly":
          return true;
        case "bi-weekly":
          return i % 2 === 0;
        case "monthly":
          return i % 4 === 0;
        default:
          return false;
      }
    })
    .filter((date) => Date.now() < date.getTime())
    .sort((a, b) => a.getTime() - b.getTime())[0];
};

export const RepeatingHappeningSidebar = async ({ event }: EventSidebarProps) => {
  const user = await auth();

  const nextOccurrence = getNextOccurrence(event);

  return (
    <div className="flex w-full flex-col gap-4 lg:max-w-[320px]">
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

      <Sidebar className="grid grid-cols-1">
        <div className="flex flex-col gap-2">
          {/**
           * Show location if:
           * - There is a location set
           */}
          {event.location && (
            <SidebarItem>
              <SidebarItemTitle>Sted:</SidebarItemTitle>
              {event.location.link ? (
                <SidebarItemContent>
                  <a
                    className="hover:underline"
                    href={event.location.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.location.name} <ExternalLink className="ml-1 inline-block h-4 w-4" />
                  </a>
                </SidebarItemContent>
              ) : (
                <SidebarItemContent>{event.location.name}</SidebarItemContent>
              )}
            </SidebarItem>
          )}

          <SidebarItem>
            <SidebarItemTitle>Dager:</SidebarItemTitle>
            <SidebarItemContent>{DAYS[event.dayOfWeek]}</SidebarItemContent>
          </SidebarItem>

          <SidebarItem>
            <SidebarItemTitle>Hyppighet:</SidebarItemTitle>
            <SidebarItemContent>{intervalToText(event.interval)}</SidebarItemContent>
          </SidebarItem>

          <SidebarItem>
            <SidebarItemTitle>Neste gang:</SidebarItemTitle>
            <SidebarItemContent>
              {nextOccurrence === undefined
                ? "Ingen planlagte"
                : capitalize(
                    nextOccurrence.toLocaleDateString("nb-NO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }),
                  )}
            </SidebarItemContent>
          </SidebarItem>

          <SidebarItem>
            <SidebarItemTitle>Tid:</SidebarItemTitle>
            <SidebarItemContent>
              {event.startTime.hour.toString().padStart(2, "0")}:
              {event.startTime.minute.toString().padStart(2, "0")} -{" "}
              {event.endTime.hour.toString().padStart(2, "0")}:
              {event.endTime.minute.toString().padStart(2, "0")}
            </SidebarItemContent>
          </SidebarItem>

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

      {/**
       * Show reaction buttons if:
       * - User is logged in
       */}
      {Boolean(user) && <ReactionButtonGroup reactToKey={event._id} />}
    </div>
  );
};
