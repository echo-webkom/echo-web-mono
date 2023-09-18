"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isAfter, isBefore, isThisWeek, isWithinInterval, nextMonday, set } from "date-fns";

import { type Bedpres } from "@/sanity/bedpres";
import { type Event } from "@/sanity/event";
import { CombinedHappeningPreview } from "./happening-preview-box";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type EventsProps = {
  events: Array<
    | (Event & {
        type: "EVENT";
      })
    | (Bedpres & {
        type: "BEDPRES";
      })
  >;
};

/**
export const EventsView() {
    const search = useSearchParams();
    const searchQuery = search ? search.get("q") : null;
    const encodedSearchQuery = encodeURI(searchQuery ?? "");

    const [happenings, isLoading] = await Promise.all([]);

    if (!happenings.ok) {
        return <div>Something went wrong</div>;
        }

    return ({happenings.length > 0 && (
        <div>
          {happenings.map((hap) => (
            <ul key={hap._id} className="py-1">
              <CombinedHappeningPreview happening={hap} />
            </ul>
          ))}
        </div>
      )})

}
**/

export default function Events({ events }: EventsProps) {
  const [isAll, setIsAll] = useState(true);
  const [isBedpres, setIsBedpres] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPast, setIsPast] = useState(false);

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showThisWeek, setShowThisWeek] = useState(true);
  const [showNextWeek, setShowNextWeek] = useState(true);
  const [showLater, setShowLater] = useState(true);

  const handleSearch = () => {
    if (searchQuery !== "") {
      const encodedSearchQuery = encodeURI(searchQuery);
      router.push(`?q=${encodedSearchQuery}`);
    }

    if (isAll) {
      router.push(`?type=ALL`);
    } else if (isBedpres) {
      router.push(`?type=BEDPRES`);
    } else if (isEvent) {
      router.push(`?type=EVENT`);
    }

    if (isOpen) {
      router.push(`?open=true`);
    }

    if (isPast) {
      router.push(`?past=true`);
    }

    if (showThisWeek) {
      router.push(`?thisWeek=true`);
    }

    if (showNextWeek) {
      router.push(`?nextWeek=true`);
    }

    if (showLater) {
      router.push(`?later=true`);
    }
  };

  const handleTypeChange = (type: string) => {
    setIsAll(type === "ALL");
    setIsBedpres(type === "BEDPRES");
    setIsEvent(type === "EVENT");
  };

  /**
  const filteredEvents = events
    .filter((event) => {
      if (event.type === "EVENT" && (isEvent || isAll)) {
        return (
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.organizers.some((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      if (event.type === "BEDPRES" && (isBedpres || isAll)) {
        return event.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

  const currentDate = new Date();

  const filterIsOpen = filteredEvents.filter((event) => {
    if (isOpen) {
      return (
        event.registrationStart &&
        event.registrationEnd &&
        isAfter(currentDate, new Date(event.registrationStart)) &&
        isBefore(currentDate, new Date(event.registrationEnd))
      );
    }
    return true;
  });

  const earlier: typeof filterIsOpen = [];
  const thisWeek: typeof filterIsOpen = [];
  const nextWeek: typeof filterIsOpen = [];
  const later: typeof filterIsOpen = [];

  filterIsOpen.forEach((event) => {
    if (event.date) {
      if (isBefore(new Date(event.date), currentDate)) {
        return earlier.push(event);
      } else if (isThisWeek(new Date(event.date))) {
        return thisWeek.push(event);
      } else if (
        isWithinInterval(new Date(event.date), {
          start: nextMonday(currentDate),
          end: nextMonday(nextMonday(currentDate)),
        })
      ) {
        return nextWeek.push(event);
      }
    }
    return later.push(event);
  });
  **/

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center border-b-2 border-solid border-gray-400 border-opacity-20 pb-5 md:justify-between">
        <div className="md:space-x-3">
          <Button variant={isAll ? "default" : "outline"} onClick={() => handleTypeChange("ALL")}>
            Alle
          </Button>
          <Button
            variant={isEvent ? "default" : "outline"}
            onClick={() => handleTypeChange("EVENT")}
          >
            Arrangementer
          </Button>
          <Button
            variant={isBedpres ? "default" : "outline"}
            onClick={() => handleTypeChange("BEDPRES")}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="space-x-3">
          <Button
            className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap"
            variant={isOpen ? "default" : "outline"}
            onClick={() => {
              setIsOpen((prev) => !prev);
              if (isPast) setIsPast(false);
            }}
          >
            Åpen for påmelding
          </Button>
          <Button
            variant={isPast ? "default" : "outline"}
            onClick={() => {
              setIsPast((prev) => !prev);
              if (isOpen) setIsOpen(false);
            }}
          >
            Vis tidligere
          </Button>
        </div>
      </div>
      <div className="container flex flex-col gap-5 md:flex-row md:gap-0">
        <div className="left-panel flex w-full flex-col md:w-1/4">
          <div className="p-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              type="text"
              placeholder="Søk etter arrangement"
            />
          </div>
          <div className="p-4">
            <div className="mb-2 text-xl font-semibold">Tidspunkt</div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={showThisWeek}
                onCheckedChange={() => setShowThisWeek((prev) => !prev)}
              />
              <Label className="ml-2 text-base">Denne uken</Label>
            </div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={showNextWeek}
                onCheckedChange={() => setShowNextWeek((prev) => !prev)}
              />
              <Label className="ml-2 text-base">Neste uke</Label>
            </div>

            <div className="flex items-center">
              <Checkbox checked={showLater} onCheckedChange={() => setShowLater((prev) => !prev)} />
              <Label className="ml-2 text-base">Senere</Label>
            </div>
          </div>
        </div>
        <div className="right-panel w-3/4 md:w-3/4">
          <EventsView />
        </div>
      </div>
    </div>
  );
}
