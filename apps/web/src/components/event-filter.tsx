"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";

// import { BorderWidthIcon } from "@radix-ui/react-icons";

// import { isAfter, isBefore, isThisWeek, isWithinInterval, nextMonday, set } from "date-fns";
import { fetchFilteredBedpresses, type Bedpres } from "@/sanity/bedpres";
import { fetchFilteredEvents, type Event } from "@/sanity/event";
import { isErrorMessage } from "@/utils/error";
import { CombinedHappeningPreview } from "./happening-preview-box";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type Happening =
  | (Event & {
      type: "EVENT";
    })
  | (Bedpres & {
      type: "BEDPRES";
    });

const initialParams = {
  type: "ALL",
  search: "",
  open: false,
  past: false,
  thisWeek: true,
  nextWeek: true,
  later: true,
};

export type SearchParams = {
  type: string;
  search?: string;
  open?: string;
  past?: string;
  thisWeek?: string;
  nextWeek?: string;
  later?: string;
};

function EventsView() {
  const [happenings, setHappenings] = useState<Array<Happening>>([]);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const validQuery = validateQuery(params);

      const bedpresses =
        validQuery.type === "all" || validQuery.type === "bedpres"
          ? await fetchFilteredBedpresses(validQuery)
          : [];
      const events =
        validQuery.type === "all" || validQuery.type === "event"
          ? await fetchFilteredEvents(validQuery)
          : [];

      if (isErrorMessage(events) || isErrorMessage(bedpresses)) {
        return new Response("Error fetching data from Sanity", {
          status: 500,
        });
      }

      const combinedHappenings = [
        ...events.map((e) => ({ ...e, type: "EVENT" as const })),
        ...bedpresses.map((b) => ({ ...b, type: "BEDPRES" as const })),
      ].sort((a, b) => {
        if (a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
      });

      setHappenings(combinedHappenings);
    };
    setLoading(false);
    fetchData().catch(console.error);
  }, [params]);

  if (loading)
    return (
      <>
        {happenings.length > 0 && (
          <div>
            {happenings.map((hap) => (
              <ul key={hap._id} className="py-1">
                <CombinedHappeningPreview happening={hap} />
              </ul>
            ))}
          </div>
        )}
        {happenings.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-2xl font-semibold">Ingen arrangementer funnet</div>
            <div className="text-lg text-gray-500">
              Prøv å endre på søkeparametrene eller søk etter noe annet
            </div>
          </div>
        )}
      </>
    );
}

function validateQuery(params: ReadonlyURLSearchParams) {
  const query: SearchParams = {
    search: params.get("search") ?? undefined,
    type: params.get("type") ?? "all",
    open: params.get("open") ?? undefined,
    past: params.get("past") ?? undefined,
    thisWeek: params.get("thisWeek") ?? undefined,
    nextWeek: params.get("nextWeek") ?? undefined,
    later: params.get("later") ?? undefined,
  };

  if (!(query.type === "all" || query.type === "event" || query.type === "bedpres")) {
    query.type = "all";
  }
  if (query.search && query.search.length > 100) {
    query.search = query.search.substring(0, 100);
  }

  if (query.past === "true") {
    query.thisWeek = undefined;
    query.nextWeek = undefined;
    query.later = undefined;
  }

  query.open = query.open === "true" ? "true" : undefined;
  query.past = query.past === "true" ? "true" : undefined;
  query.thisWeek = query.thisWeek === "true" ? "true" : undefined;
  query.nextWeek = query.nextWeek === "true" ? "true" : undefined;
  query.later = query.later === "true" ? "true" : undefined;

  return query;
}

export default function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState("");
  const [searchParams, setSearchParams] = useState(initialParams);

  useEffect(() => {
    const query: SearchParams = { type: "all" };

    if (searchParams.type) query.type = searchParams.type;
    if (searchParams.search) query.search = encodeURI(searchParams.search);
    if (searchParams.open) query.open = "true";
    if (searchParams.past) query.past = "true";
    if (searchParams.thisWeek) query.thisWeek = "true";
    if (searchParams.nextWeek) query.nextWeek = "true";
    if (searchParams.later) query.later = "true";

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ``}`);
  }, [searchParams, pathname, router]);

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
          <Button
            variant={searchParams.type === "all" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "all" })}
          >
            Alle
          </Button>
          <Button
            variant={searchParams.type === "event" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "event" })}
          >
            Arrangementer
          </Button>
          <Button
            variant={searchParams.type === "bedpres" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "bedpres" })}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="space-x-3">
          <Button
            className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap"
            variant={searchParams.open ? "default" : "outline"}
            onClick={() =>
              setSearchParams({ ...searchParams, open: !searchParams.open, past: false })
            }
          >
            Åpen for påmelding
          </Button>
          <Button
            variant={searchParams.past ? "default" : "outline"}
            onClick={() =>
              setSearchParams({ ...searchParams, past: !searchParams.past, open: false })
            }
          >
            Vis tidligere
          </Button>
        </div>
      </div>
      <div className="container flex flex-col gap-5 md:flex-row md:gap-0">
        <div className="left-panel flex w-full flex-col md:w-1/4">
          <div className="p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchParams({ ...searchParams, search: input });
              }}
              type="text"
              placeholder="Søk etter arrangement"
            />
          </div>
          <div className="p-4">
            <div className="mb-2 text-xl font-semibold">Tidspunkt</div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={searchParams.thisWeek}
                onCheckedChange={() =>
                  setSearchParams({ ...searchParams, thisWeek: !searchParams.thisWeek })
                }
              />
              <Label className="ml-2 text-base">Denne uken</Label>
            </div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={searchParams.nextWeek}
                onCheckedChange={() =>
                  setSearchParams({ ...searchParams, nextWeek: !searchParams.nextWeek })
                }
              />
              <Label className="ml-2 text-base">Neste uke</Label>
            </div>

            <div className="flex items-center">
              <Checkbox
                checked={searchParams.later}
                onCheckedChange={() =>
                  setSearchParams({ ...searchParams, later: !searchParams.later })
                }
              />
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
