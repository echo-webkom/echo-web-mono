"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { isBefore, isThisWeek, isWithinInterval, nextMonday, startOfDay } from "date-fns";
import { AiOutlineLoading } from "react-icons/ai";

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
      type: "arrangement";
    })
  | (Bedpres & {
      type: "bedpres";
    });

// For querying Sanity
export type QueryParams = {
  type: "all" | "event" | "bedpres";
  search?: string;
  open?: string;
  past?: string;
};

// For handling state
export type SearchParams = {
  type: "all" | "event" | "bedpres";
  search?: string;
  open: boolean;
  past: boolean;
};

// Makes it so URLs can be shared with filters intact
function URLtoSearchParams(url: ReadonlyURLSearchParams) {
  const params: SearchParams = {
    type: (url.get("type") as "event" | "bedpres" | "all") ?? "all",
    search: url.get("search") ?? undefined,
    open: url.get("open") === "true" ? true : false,
    past: url.get("past") === "true" ? true : false,
  };

  if (params.open && params.past) {
    params.open = false;
    params.past = false;
  }

  if (!(params.type === "all" || params.type === "event" || params.type === "bedpres")) {
    params.type = "all";
  }

  return params;
}

// Sanitizes the query params before fetching data
function validateParamsToQuery(params: SearchParams) {
  const query: QueryParams = {
    search: params.search ?? undefined,
    type: params.type ?? "all",
    open: params.open ? "true" : undefined,
    past: params.past ? "true" : undefined,
  };

  if (!(query.type === "all" || query.type === "event" || query.type === "bedpres")) {
    query.type = "all";
  }
  if (query.search) {
    query.search = removeInvalidChars(query.search);
    if (query.search.length > 50) {
      query.search = query.search.substring(0, 50);
    }
  }

  return query;
}

function removeInvalidChars(str: string) {
  return str.replace(/[^ a-zæøåÆØÅ0-9-]/g, "");
}

function EventsView({ happenings, show }: { happenings: Array<Happening>; show: boolean }) {
  return (
    <>
      {happenings.length > 0 && show && (
        <div>
          {happenings.map((event) => (
            <ul key={event._id} className="py-1">
              <CombinedHappeningPreview happening={event} />
            </ul>
          ))}
        </div>
      )}
    </>
  );
}

export default function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [searchParams, setSearchParams] = useState(URLtoSearchParams(params));
  const [input, setInput] = useState(searchParams.search ?? "");

  const [happenings, setHappenings] = useState<Array<Happening>>([]);
  const [isLoading, setLoading] = useState(true);

  const [showThisWeek, setShowThisWeek] = useState(true);
  const [showNextWeek, setShowNextWeek] = useState(true);
  const [showLater, setShowLater] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const p = URLtoSearchParams(params);
      const validQuery = validateParamsToQuery(p);

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
        ...events.map((e) => ({ ...e, type: "arrangement" as const })),
        ...bedpresses.map((b) => ({ ...b, type: "bedpres" as const })),
      ].sort((a, b) => {
        if (a.date && b.date) {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
      });

      setHappenings(combinedHappenings);
      setLoading(false);
    };
    fetchData().catch(console.error);
  }, [params]);

  useEffect(() => {
    const query: QueryParams = { type: "all" };

    if (searchParams.type) query.type = searchParams.type;
    if (searchParams.search) query.search = searchParams.search;
    if (searchParams.open) query.open = "true";
    if (searchParams.past) query.past = "true";

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ``}`);
  }, [searchParams, pathname, router]);

  const currentDate = new Date();

  const earlier: Array<Happening> = [];
  const thisWeek: Array<Happening> = [];
  const nextWeek: Array<Happening> = [];
  const later: Array<Happening> = [];

  happenings.forEach((event) => {
    if (event.date) {
      if (isBefore(new Date(event.date), currentDate)) {
        return earlier.push(event);
      } else if (isThisWeek(new Date(event.date))) {
        return thisWeek.push(event);
      } else if (
        isWithinInterval(new Date(event.date), {
          start: startOfDay(nextMonday(currentDate)),
          end: startOfDay(nextMonday(nextMonday(currentDate))),
        })
      ) {
        return nextWeek.push(event);
      }
    }
    return later.push(event);
  });

  return (
    <div className="mt-4 flex min-h-full flex-col gap-5">
      <div className="flex flex-col items-center gap-10 border-b-2 border-solid border-gray-400 border-opacity-20 pb-8 sm:flex-row sm:justify-between sm:pb-4">
        <div className="flex flex-col flex-wrap space-x-0 sm:flex-row lg:space-x-3">
          <Button
            className="w-full sm:w-auto"
            variant={searchParams.type === "all" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "all" })}
          >
            Alle
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={searchParams.type === "event" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "event" })}
          >
            Arrangementer
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={searchParams.type === "bedpres" ? "default" : "outline"}
            onClick={() => setSearchParams({ ...searchParams, type: "bedpres" })}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="flex w-48 flex-col flex-wrap justify-end sm:w-auto sm:flex-row lg:space-x-3">
          <Button
            className="overflow-hidden truncate overflow-ellipsis whitespace-nowrap"
            variant={searchParams.open ? "default" : "outline"}
            onClick={() => setSearchParams((prev) => ({ ...prev, open: !prev.open, past: false }))}
          >
            Åpen for påmelding
          </Button>
          <Button
            variant={searchParams.past ? "default" : "outline"}
            onClick={() => setSearchParams((prev) => ({ ...prev, past: !prev.past, open: false }))}
          >
            Vis tidligere
          </Button>
        </div>
      </div>
      <div className="container flex flex-col gap-5 md:flex-row md:gap-0">
        <div className="left-panel flex w-full flex-col md:w-1/4">
          <div className="p-4">
            <div className="flex rounded-lg border border-gray-300 hover:border-gray-500 focus:ring-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearchParams({ ...searchParams, search: input });
                }}
                type="text"
                placeholder="Søk etter arrangement"
                className="appearance-none border-none bg-transparent outline-none focus:ring-0 focus:ring-offset-0"
              />
              {input !== "" && (
                <button className="p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => {
                      setInput(""), setSearchParams({ ...searchParams, search: "" });
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-2 text-xl font-semibold">Tidspunkt</div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={showThisWeek}
                onCheckedChange={() => setShowThisWeek((prev) => !prev)}
              />
              <Label className="ml-2 text-base">Denne uken ({thisWeek.length})</Label>
            </div>

            <div className="mb-2 flex items-center">
              <Checkbox
                checked={showNextWeek}
                onCheckedChange={() => setShowNextWeek((prev) => !prev)}
              />
              <Label className="ml-2 text-base">Neste uke ({nextWeek.length})</Label>
            </div>

            <div className="flex items-center">
              <Checkbox checked={showLater} onCheckedChange={() => setShowLater((prev) => !prev)} />
              <Label className="ml-2 text-base">Senere ({later.length})</Label>
            </div>
          </div>
        </div>
        <div className="right-panel w-3/4 md:w-3/4">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <AiOutlineLoading className="animate-spin" />
            </div>
          )}

          {!isLoading &&
            happenings.length !== 0 &&
            (showThisWeek ? thisWeek.length : 0) +
              (showNextWeek ? nextWeek.length : 0) +
              (showLater ? later.length : 0) +
              earlier.length ===
              0 && (
              <div className="px-3 py-5 text-center text-lg font-medium">
                <p>Her var det tomt gitt!</p>
              </div>
            )}

          {happenings.length === 0 && !isLoading && (
            <div className="px-3 py-5 text-center text-lg font-medium">
              <p>Ingen arrangementer funnet</p>
              <p>Prøv å endre søket ditt</p>
            </div>
          )}

          <EventsView happenings={earlier} show={searchParams.past} />
          <EventsView happenings={thisWeek} show={showThisWeek} />
          <EventsView happenings={nextWeek} show={showNextWeek} />
          <EventsView happenings={later} show={showLater} />
        </div>
      </div>
    </div>
  );
}
