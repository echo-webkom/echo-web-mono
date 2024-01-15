"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowDownNarrowWide } from "lucide-react";
import { useDebounce } from "use-debounce";

import { type SearchParams } from "@/app/(default)/for-studenter/arrangementer/page";
import { cn } from "@/utils/cn";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function EventFilter({ params }: { params: SearchParams }) {
  const router = useRouter();
  const pathname = usePathname();

  const [eventParams, setEventParams] = useState({
    type: params.type === "event" || params.type === "bedpres" ? params.type : "all",
    past: params.past === "true" ? true : false,
  });

  const [searchInput, setSearchInput] = useState(params.search ?? "");
  const [isAsc, setIsAsc] = useState(params.order === "ASC" ? true : false);

  const [search] = useDebounce(searchInput, 300);

  useEffect(() => {
    const newURL = new URLSearchParams(params);

    if (eventParams.type === "event" || eventParams.type === "bedpres") {
      newURL.set("type", eventParams.type);
    } else {
      newURL.delete("type");
    }

    if (eventParams.past === true) {
      newURL.set("past", "true");
    } else {
      newURL.delete("past");
    }

    if (search) {
      newURL.set("search", search);
    } else {
      newURL.delete("search");
    }

    if (isAsc) {
      newURL.set("order", "ASC");
    } else {
      newURL.delete("order");
    }

    const route = newURL.toString();

    if (route !== new URLSearchParams(params).toString()) {
      router.push(`${pathname}?${route}`);
    }
  }, [pathname, router, eventParams, search, isAsc, params]);

  return (
    <div>
      <div className="flex flex-col items-center gap-10 border-b-2 border-solid border-border border-opacity-20 pb-8 sm:flex-row sm:justify-between sm:pb-4">
        <div className="flex flex-col flex-wrap space-x-0 sm:flex-row lg:space-x-3">
          <Button
            className="w-full sm:w-auto"
            variant={eventParams.type === "all" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "all" })}
          >
            Alle
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={eventParams.type === "event" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "event" })}
          >
            Arrangementer
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant={eventParams.type === "bedpres" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "bedpres" })}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="flex w-48 flex-col flex-wrap justify-end sm:w-auto sm:flex-row lg:space-x-3">
          <Button
            variant={"outline"}
            onClick={() => setEventParams((prev) => ({ ...prev, past: !prev.past }))}
          >
            {eventParams.past ? "Vis kommende" : "Vis tidligere"}
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex rounded-lg border border-border hover:border-gray-500 focus:ring-0">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Søk etter arrangement..."
            className="appearance-none border-none bg-transparent outline-none focus:ring-0 focus:ring-offset-0"
          />
          {searchInput !== "" && (
            <button className="p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  setSearchInput("");
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
        <span>
          <ArrowDownNarrowWide
            className={cn("h-6 w-6 cursor-pointer transition duration-200 ease-in-out", {
              "rotate-180 transform": isAsc,
            })}
            onClick={() => setIsAsc(!isAsc)}
          />
        </span>
      </div>
    </div>
  );
}

export function EventFilterSidebar({
  params,
  numOfEvents: { numThisWeek, numNextWeek, numLater },
}: {
  params: SearchParams;
  numOfEvents: {
    numThisWeek: number;
    numNextWeek: number;
    numLater: number;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [dateParams, setDateParams] = useState({
    thisWeek: params.thisWeek === "false" ? false : true,
    nextWeek: params.nextWeek === "false" ? false : true,
    later: params.later === "false" ? false : true,
  });

  const [showOpen, setShowOpen] = useState(params.open === "true" ? true : false);

  useEffect(() => {
    const newURL = new URLSearchParams(params);

    if (dateParams.thisWeek === false) {
      newURL.set("thisWeek", "false");
    } else {
      newURL.delete("thisWeek");
    }

    if (dateParams.nextWeek === false) {
      newURL.set("nextWeek", "false");
    } else {
      newURL.delete("nextWeek");
    }

    if (dateParams.later === false) {
      newURL.set("later", "false");
    } else {
      newURL.delete("later");
    }

    if (showOpen === true) {
      newURL.set("open", "true");
    } else {
      newURL.delete("open");
    }

    const route = newURL.toString();

    if (route !== new URLSearchParams(params).toString()) {
      router.push(`${pathname}?${route}`);
    }
  }, [pathname, router, dateParams, showOpen, params]);

  return (
    <Sidebar>
      <SidebarItem>
        <SidebarItemContent>
          <Checkbox
            checked={showOpen}
            onCheckedChange={() => {
              setShowOpen(!showOpen);
            }}
          />
          <Label>Vis kun åpne for påmelding</Label>
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Tidspunkt:</SidebarItemTitle>

        <SidebarItemContent>
          <Checkbox
            checked={dateParams.thisWeek}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                thisWeek: !dateParams.thisWeek,
              });
            }}
          />
          <Label>Denne uken ({numThisWeek})</Label>
        </SidebarItemContent>

        <SidebarItemContent>
          <Checkbox
            checked={dateParams.nextWeek}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                nextWeek: !dateParams.nextWeek,
              });
            }}
          />
          <Label>Neste uke ({numNextWeek})</Label>
        </SidebarItemContent>

        <SidebarItemContent>
          <Checkbox
            checked={dateParams.later}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                later: !dateParams.later,
              });
            }}
          />
          <Label>Senere ({numLater})</Label>
        </SidebarItemContent>
      </SidebarItem>
    </Sidebar>
  );
}
