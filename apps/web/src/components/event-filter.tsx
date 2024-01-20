"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuArrowDownNarrowWide as ArrowDownNarrowWide } from "react-icons/lu";
import { useDebounce } from "use-debounce";

import { cn } from "@/utils/cn";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filter = {
    type:
      params.get("type") === "event" || params.get("type") === "bedpres"
        ? params.get("type")
        : "all",
    past: params.get("past") === "true" ? true : false,
    showAsc: params.get("order") === "ASC" ? true : false,
  };

  function updateFilter(element: string) {
    const searchParams = new URLSearchParams(params.toString());

    switch (element) {
      case "all":
        searchParams.delete("type");
        break;
      case "event":
        searchParams.set("type", "event");
        break;
      case "bedpres":
        searchParams.set("type", "bedpres");
        break;
      case "past":
        filter.past ? searchParams.delete("past") : searchParams.set("past", "true");
        break;
      case "order":
        filter.showAsc ? searchParams.delete("order") : searchParams.set("order", "ASC");
        break;
    }

    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  return (
    <div className="space-y-5 border-b-2 border-solid border-opacity-20 pb-3">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center sm:flex-row sm:space-x-2">
          <Button
            className="w-60 sm:w-auto"
            variant={filter.type === "all" ? "default" : "outline"}
            onClick={() => updateFilter("all")}
          >
            Alle
          </Button>
          <Button
            className="w-60 sm:w-auto"
            variant={filter.type === "event" ? "default" : "outline"}
            onClick={() => updateFilter("event")}
          >
            Arrangementer
          </Button>
          <Button
            className="w-60 sm:w-auto"
            variant={filter.type === "bedpres" ? "default" : "outline"}
            onClick={() => updateFilter("bedpres")}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="w-60 sm:w-auto"
            variant={"outline"}
            onClick={() => updateFilter("past")}
          >
            {filter.past ? "Vis kommende" : "Vis tidligere"}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="mr-2">
          <ArrowDownNarrowWide
            className={cn("h-6 w-6 cursor-pointer transition duration-200 ease-in-out", {
              "rotate-180 transform": filter.showAsc,
            })}
            onClick={() => updateFilter("order")}
          />
        </span>
      </div>
    </div>
  );
}

export function EventFilterSidebar({
  numOfEvents: { numThisWeek, numNextWeek, numLater },
}: {
  numOfEvents: {
    numThisWeek: number;
    numNextWeek: number;
    numLater: number;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const inputRef = useRef(false);

  const filter = {
    search: params.get("search") ?? "",
    thisWeek: params.get("thisWeek") === "false" ? false : true,
    nextWeek: params.get("nextWeek") === "false" ? false : true,
    later: params.get("later") === "false" ? false : true,
    open: params.get("open") === "true" ? true : false,
  };

  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");
  const [search] = useDebounce(searchInput, 300);

  useEffect(() => {
    if (inputRef.current) {
      const searchParams = new URLSearchParams(params.toString());
      search ? searchParams.set("search", search) : searchParams.delete("search");
      router.push(`${pathname}?${searchParams}`, { scroll: false });
      inputRef.current = false;
    } else {
      setSearchInput(params.get("search") ?? "");
    }
  }, [router, pathname, params, search]);

  function updateFilter(element: string) {
    const searchParams = new URLSearchParams(params.toString());

    switch (element) {
      case "thisWeek":
        filter.thisWeek ? searchParams.set("thisWeek", "false") : searchParams.delete("thisWeek");
        break;
      case "nextWeek":
        filter.nextWeek ? searchParams.set("nextWeek", "false") : searchParams.delete("nextWeek");
        break;
      case "later":
        filter.later ? searchParams.set("later", "false") : searchParams.delete("later");
        break;
      case "open":
        filter.open ? searchParams.delete("open") : searchParams.set("open", "true");
        break;
    }

    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  return (
    <Sidebar className="mb-5 mt-5 space-y-3">
      <SidebarItem>
        <SidebarItemContent>
          <div className="relative flex rounded-lg border hover:border-gray-500">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                inputRef.current = true;
              }}
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
                    inputRef.current = true;
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
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle className="mb-2">Tidspunkt:</SidebarItemTitle>

        <SidebarItemContent className="mb-2 flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="thisWeek"
            checked={filter.thisWeek}
            onCheckedChange={() => updateFilter("thisWeek")}
          />
          <Label htmlFor="thisWeek" className="ml-2 cursor-pointer text-sm">
            Denne uken ({numThisWeek})
          </Label>
        </SidebarItemContent>

        <SidebarItemContent className="mb-2 flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="nextWeek"
            checked={filter.nextWeek}
            onCheckedChange={() => updateFilter("nextWeek")}
          />
          <Label htmlFor="nextWeek" className="ml-2 cursor-pointer text-sm">
            Neste uke ({numNextWeek})
          </Label>
        </SidebarItemContent>

        <SidebarItemContent className="flex items-center">
          <Checkbox
            className="hover:bg-blue-100"
            id="later"
            checked={filter.later}
            onCheckedChange={() => updateFilter("later")}
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
            checked={filter.open}
            onCheckedChange={() => updateFilter("open")}
          />
          <Label htmlFor="showOpen" className="ml-2 cursor-pointer text-sm">
            Åpen for påmelding
          </Label>
        </SidebarItemContent>
      </SidebarItem>
    </Sidebar>
  );
}
