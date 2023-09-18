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

const initialParams = {
  q: "",
  type: "ALL",
  open: false,
  past: false,
  thisWeek: true,
  nextWeek: true,
  later: true,
};

export type Query = {
    q: string,
    type: string,
    open: boolean,
    past: boolean,
    thisWeek: boolean,
    nextWeek: boolean,
    later: boolean,
}


function EventsView() {
    const params = useSearchParams();
    const query = {
        q: params.get("q") ?? undefined,
        type: params.get("type") ?? undefined,
        open: params.get("open") ?? undefined,
        past: params.get("past") ?? undefined,
        thisWeek: params.get("thisWeek") ?? undefined,
        nextWeek: params.get("nextWeek") ?? undefined,
        later: params.get("later") ?? undefined,
    }



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


export default function EventFilter() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState(initialParams);

  const handleSearch = () => {
    const query = {
        q: encodeURI(searchParams.q) ?? undefined,
        type: searchParams.type ?? undefined,
        open: searchParams.open ? 'true' : undefined,
        past: searchParams.past ? 'true' : undefined,
        thisWeek: searchParams.thisWeek ? 'true' : undefined,
        nextWeek: searchParams.nextWeek ? 'true' : undefined,
        later: searchParams.later ? 'true' : undefined,
      },
    
    router.push({ pathname: '/for-students/arrangementer', query });
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
          <Button variant={searchParams.type === "ALL" ? "default" : "outline"} onClick={() => setSearchParams({ ...searchParams, type: "ALL"})}>
            Alle
          </Button>
          <Button
            variant={searchParams.type === "EVENT" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "EVENT"})}
          >
            Arrangementer
          </Button>
          <Button
            variant={searchParams.type === "BEDPRES" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "BEDPRES"})}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="space-x-3">
          <Button
            className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap"
            variant={searchParams.open ? "default" : "outline"}
            onClick={() => {setSearchParams({...searchParams, open: !searchParams.open, past: false })}}
          >
            Åpen for påmelding
          </Button>
          <Button
            variant={searchParams.past ? "default" : "outline"}
            onClick={() => {setSearchParams({...searchParams, past: !searchParams.past, open: false })}}

          >
            Vis tidligere
          </Button>
        </div>
      </div>
      <div className="container flex flex-col gap-5 md:flex-row md:gap-0">
        <div className="left-panel flex w-full flex-col md:w-1/4">
          <div className="p-4">
            <Input
              value={searchParams.q}
              onChange={(e) => setSearchParams({ ...searchParams, q: e.currentTarget.value})}
              type="text"
              placeholder="Søk etter arrangement"
            />
          </div>
          <div className="p-4">
            <div className="mb-2 text-xl font-semibold">Tidspunkt</div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={searchParams.thisWeek}
                onCheckedChange={() => setSearchParams({ ...searchParams, thisWeek: !searchParams.thisWeek})}
              />
              <Label className="ml-2 text-base">Denne uken</Label>
            </div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={searchParams.nextWeek}
                onCheckedChange={() => setSearchParams({...searchParams, nextWeek: !searchParams.nextWeek})}
              />
              <Label className="ml-2 text-base">Neste uke</Label>
            </div>

            <div className="flex items-center">
              <Checkbox checked={searchParams.later} onCheckedChange={() => setSearchParams({...searchParams, later: !searchParams.later})} />
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
