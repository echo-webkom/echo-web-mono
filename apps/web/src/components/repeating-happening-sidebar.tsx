import { RxExternalLink as ExternalLink } from "react-icons/rx";

import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "@/components/sidebar";
import { Callout } from "@/components/typography/callout";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/get-user";
import { type fetchRepeatingHappening } from "@/sanity/repeating-happening";
import { mailTo } from "@/utils/prefixes";
import { ReactionButtonGroup } from "./reaction-button-group";

const DAYS = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

type EventSidebarProps = {
  event: Exclude<Awaited<ReturnType<typeof fetchRepeatingHappening>>, null>;
};

export const RepeatingHappeningSidebar = async ({ event }: EventSidebarProps) => {
  const user = await getUser();

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
              <SidebarItemContent>{event.location.name}</SidebarItemContent>
            </SidebarItem>
          )}

          <SidebarItem>
            <SidebarItemTitle>Dager:</SidebarItemTitle>
            <SidebarItemContent>{DAYS[event.dayOfWeek]}</SidebarItemContent>
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
