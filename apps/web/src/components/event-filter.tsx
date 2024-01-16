"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LuArrowDownNarrowWide as ArrowDownNarrowWide } from "react-icons/lu";
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
      router.push(`${pathname}?${route}`, { scroll: false });
    }
  }, [pathname, router, eventParams, search, isAsc, params]);

  return (
    <div className="space-y-5 border-b-2 border-solid border-opacity-20 pb-3">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center sm:flex-row sm:space-x-2">
          <Button
            className="w-60 sm:w-auto"
            variant={eventParams.type === "all" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "all" })}
          >
            Alle
          </Button>
          <Button
            className="w-60 sm:w-auto"
            variant={eventParams.type === "event" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "event" })}
          >
            Arrangementer
          </Button>
          <Button
            className="w-60 sm:w-auto"
            variant={eventParams.type === "bedpres" ? "default" : "outline"}
            onClick={() => setEventParams({ ...eventParams, type: "bedpres" })}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="w-60 sm:w-auto"
            variant={"outline"}
            onClick={() => setEventParams((prev) => ({ ...prev, past: !prev.past }))}
          >
            {eventParams.past ? "Vis kommende" : "Vis tidligere"}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="relative flex rounded-lg border hover:border-gray-500">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Søk..."
            className="border-none bg-transparent pr-6"
          />
          {searchInput !== "" && (
            <button className="absolute inset-y-0 right-1">
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
        <span className="mr-2">
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
      router.push(`${pathname}?${route}`, { scroll: false });
    }
  }, [pathname, router, dateParams, showOpen, params]);

  return (
    <Sidebar className="mb-5 mt-5 space-y-3">
      <SidebarItem>
        <SidebarItemTitle className="mb-2">Tidspunkt:</SidebarItemTitle>

        <SidebarItemContent className="mb-2 flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="thisWeek"
            checked={dateParams.thisWeek}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                thisWeek: !dateParams.thisWeek,
              });
            }}
          />
          <Label htmlFor="thisWeek" className="ml-2 cursor-pointer text-sm">
            Denne uken ({numThisWeek})
          </Label>
        </SidebarItemContent>

        <SidebarItemContent className="mb-2 flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="nextWeek"
            checked={dateParams.nextWeek}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                nextWeek: !dateParams.nextWeek,
              });
            }}
          />
          <Label htmlFor="nextWeek" className="ml-2 cursor-pointer text-sm">
            Neste uke ({numNextWeek})
          </Label>
        </SidebarItemContent>

        <SidebarItemContent className="flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="later"
            checked={dateParams.later}
            onCheckedChange={() => {
              setDateParams({
                ...dateParams,
                later: !dateParams.later,
              });
            }}
          />
          <Label htmlFor="later" className="ml-2 cursor-pointer text-sm">
            Senere ({numLater})
          </Label>
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle className="mb-2">Vis kun:</SidebarItemTitle>

        <SidebarItemContent className="flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="showOpen"
            checked={showOpen}
            onCheckedChange={() => {
              setShowOpen(!showOpen);
            }}
          />
          <Label htmlFor="showOpen" className="ml-2 cursor-pointer text-sm">
            Åpne for påmelding
          </Label>
        </SidebarItemContent>
      </SidebarItem>
    </Sidebar>
  );
}
