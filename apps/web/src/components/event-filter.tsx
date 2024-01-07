"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";

import EventsView from "./events-view";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export type Query = {
  search?: string;
  type: "all" | "event" | "bedpres";
  open?: "true";
  past?: "true";
  thisWeek?: "true";
  nextWeek?: "true";
  later?: "true";
};

// For handling state
export type SearchParams = {
  type: "all" | "event" | "bedpres";
  search?: string;
  open?: boolean;
  past?: boolean;
  thisWeek?: boolean;
  nextWeek?: boolean;
  later?: boolean;
};

// Makes it so URLs can be shared with filters intact
function URLtoSearchParams(url: ReadonlyURLSearchParams) {
  const params: SearchParams = {
    type: (url.get("type") as "event" | "bedpres" | "all") ?? "all",
    search: url.get("search") ?? undefined,
    open: url.get("open") === "true" ? true : false,
    past: url.get("past") === "true" ? true : false,
    thisWeek: url.get("thisWeek") === "true" ? true : false,
    nextWeek: url.get("nextWeek") === "true" ? true : false,
    later: url.get("later") === "true" ? true : false,
  };

  if (params.open && params.past) {
    params.open = false;
    params.past = false;
  }

  if (params.past) {
    params.thisWeek = false;
    params.nextWeek = false;
    params.later = false;
  }

  if (params.thisWeek ?? params.nextWeek ?? params.later) {
    params.past = false;
  }

  if (!(params.type === "all" || params.type === "event" || params.type === "bedpres")) {
    params.type = "all";
  }

  return params;
}

// Sanitizes the query params before fetching data
function generateQuery(params: SearchParams) {
  const query: Query = {
    search: params.search ?? undefined,
    type: params.type ?? "all",
    open: params.open ? "true" : undefined,
    past: params.past ? "true" : undefined,
    thisWeek: params.thisWeek ? "true" : undefined,
    nextWeek: params.nextWeek ? "true" : undefined,
    later: params.later ? "true" : undefined,
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

export default function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [searchParams, setSearchParams] = useState(URLtoSearchParams(params));
  const [input, setInput] = useState(searchParams.search ?? "");
  const [validQuery, setValidQuery] = useState<Query>({ type: "all" });

  useEffect(() => {
    const p = URLtoSearchParams(params);
    setValidQuery(generateQuery(p));
  }, [params]);

  useEffect(() => {
    const query: Query = { type: searchParams.type };

    if (searchParams.search) query.search = searchParams.search;
    if (searchParams.open) query.open = "true";
    if (searchParams.past) query.past = "true";
    if (searchParams.thisWeek) query.thisWeek = "true";
    if (searchParams.nextWeek) query.nextWeek = "true";
    if (searchParams.later) query.later = "true";

    const queryString = new URLSearchParams(query).toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ``}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="mt-4 flex min-h-full flex-col gap-5">
      <div className="flex flex-col items-center gap-10 border-b-2 border-solid border-border border-opacity-20 pb-8 sm:flex-row sm:justify-between sm:pb-4">
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
            <div className="flex rounded-lg border border-border hover:border-gray-500 focus:ring-0">
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
                onCheckedChange={() => {
                  setSearchParams({
                    ...searchParams,
                    thisWeek: !searchParams.thisWeek,
                  });
                }}
              />
              <Label className="ml-2 text-base">Denne uken ()</Label>
            </div>

            <div className="mb-2 flex items-center">
              <Checkbox
                onCheckedChange={() => {
                  setSearchParams({
                    ...searchParams,
                    nextWeek: !searchParams.nextWeek,
                  });
                }}
              />
              <Label className="ml-2 text-base">Neste uke ()</Label>
            </div>

            <div className="flex items-center">
              <Checkbox
                onCheckedChange={() => {
                  setSearchParams({
                    ...searchParams,
                    later: !searchParams.later,
                  });
                }}
              />
              <Label className="ml-2 text-base">Senere ()</Label>
            </div>
          </div>
        </div>
        <div className="right-panel w-3/4 md:w-3/4">
          <EventsView {...validQuery} />
        </div>
      </div>
    </div>
  );
}
