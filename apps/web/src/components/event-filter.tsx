"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LuArrowDownNarrowWide as ArrowDownNarrowWide } from "react-icons/lu";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/utils/cn";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const { type, past, asc } = {
    type:
      params.get("type") === "event"
        ? "event"
        : params.get("type") === "bedpres"
          ? "bedpres"
          : "all",
    past: params.get("past") === "true" ? true : false,
    asc: params.get("order") === "ASC" ? true : false,
  };

  function updateFilter(element: string) {
    const searchParams = new URLSearchParams(params);

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
        past ? searchParams.delete("past") : searchParams.set("past", "true");
        break;
      case "order":
        asc ? searchParams.delete("order") : searchParams.set("order", "ASC");
        break;
    }

    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  function getButtonLabel(type: string) {
    switch (type) {
      case "all":
        return "Alle";
      case "event":
        return "Arrangementer";
      case "bedpres":
        return "Bedriftspresentasjoner";
    }
  }

  const firstButton = type === "all" ? "event" : "all";
  const secondButton = type === "bedpres" ? "event" : "bedpres";

  return (
    <div>
      <div className="flex flex-col space-y-3 border-b-2 border-solid border-opacity-20 pb-4 sm:flex-row sm:justify-between sm:space-y-0">
        <div className="flex flex-col items-center sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="w-96">{getButtonLabel(type)}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="sm:hidden">
                <DropdownMenuItem>
                  <Button
                    className="w-96"
                    variant="ghost"
                    onClick={() => updateFilter(firstButton)}
                  >
                    {getButtonLabel(firstButton)}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="w-96"
                    variant="ghost"
                    onClick={() => updateFilter(secondButton)}
                  >
                    {getButtonLabel(secondButton)}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
        <div className="hidden sm:flex sm:flex-row sm:space-x-2">
          <Button
            className="w-auto"
            variant={type === "all" ? "default" : "outline"}
            onClick={() => updateFilter("all")}
          >
            Alle
          </Button>
          <Button
            className="w-auto"
            variant={type === "event" ? "default" : "outline"}
            onClick={() => updateFilter("event")}
          >
            Arrangementer
          </Button>
          <Button
            className="w-auto"
            variant={type === "bedpres" ? "default" : "outline"}
            onClick={() => updateFilter("bedpres")}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="w-96 sm:w-auto"
            variant={"outline"}
            onClick={() => updateFilter("past")}
          >
            {past ? "Vis kommende" : "Vis tidligere"}
          </Button>
        </div>
      </div>
      <div className="hidden items-center justify-end pb-2 pt-4 sm:flex">
        <span>
          <ArrowDownNarrowWide
            className={cn("mr-2 h-6 w-6 cursor-pointer transition duration-200 ease-in-out", {
              "rotate-180 transform": asc,
            })}
            onClick={() => updateFilter("order")}
          />
        </span>
      </div>
    </div>
  );
}

type EventFilterSidebarProps = {
  numOfEvents: {
    numThisWeek: number;
    numNextWeek: number;
    numLater: number;
  };
};

export function EventFilterSidebar({
  numOfEvents: { numThisWeek, numNextWeek, numLater },
}: EventFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filterSet =
    params.has("order") ||
    params.has("search") ||
    params.has("open") ||
    params.has("past") ||
    params.has("thisWeek") ||
    params.has("nextWeek") ||
    params.has("later");

  const { thisWeek, nextWeek, later, open, asc } = {
    thisWeek: params.get("thisWeek") === "false" ? false : true,
    nextWeek: params.get("nextWeek") === "false" ? false : true,
    later: params.get("later") === "false" ? false : true,
    open: params.get("open") === "true" ? true : false,
    asc: params.get("order") === "ASC" ? true : false,
  };

  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");

  const debouncedSearch = useDebouncedCallback((search: string) => {
    const searchParams = new URLSearchParams(params);
    search ? searchParams.set("search", search) : searchParams.delete("search");
    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }, 500);

  /**
   * This useEffect sets the search input to the value in the URL when the user navigates back, etc.
   */
  const paramSearch = params.get("search") ?? "";
  useEffect(() => {
    setSearchInput(paramSearch);
  }, [paramSearch]);

  function updateFilter(element: string) {
    const searchParams = new URLSearchParams(params);

    switch (element) {
      case "thisWeek":
        thisWeek ? searchParams.set("thisWeek", "false") : searchParams.delete("thisWeek");
        break;
      case "nextWeek":
        nextWeek ? searchParams.set("nextWeek", "false") : searchParams.delete("nextWeek");
        break;
      case "later":
        later ? searchParams.set("later", "false") : searchParams.delete("later");
        break;
      case "open":
        open ? searchParams.delete("open") : searchParams.set("open", "true");
        break;
      case "order":
        asc ? searchParams.delete("order") : searchParams.set("order", "ASC");
        break;
    }

    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  function resetFilter() {
    const searchParams = new URLSearchParams();
    const type = params.get("type");
    if (type === "bedpres" || type === "event") searchParams.set("type", type);
    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  return (
    <Sidebar className="space-y-3">
      <SidebarItem>
        <SidebarItemContent className="flex items-center">
          <div className="relative flex flex-grow rounded-lg border border-gray-300 hover:border-gray-500">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                debouncedSearch(e.target.value);
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
                    const searchParams = new URLSearchParams(params);
                    searchParams.delete("search");
                    router.push(`${pathname}?${searchParams}`, { scroll: false });
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
          <span className="pl-5 sm:hidden">
            <ArrowDownNarrowWide
              className={cn(" h-6 w-6 cursor-pointer transition duration-200 ease-in-out", {
                "rotate-180 transform": asc,
              })}
              onClick={() => updateFilter("order")}
            />
          </span>
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <Accordion type="single" collapsible defaultValue="item-1" className="sm:hidden">
          <AccordionItem value="item-1">
            <AccordionTrigger>Vis flere filtre</AccordionTrigger>
            <AccordionContent>
              <SidebarItem>
                <SidebarItemTitle className="mb-2">Tidspunkt:</SidebarItemTitle>

                <SidebarItemContent className="mb-2 flex items-center">
                  <Checkbox
                    className="hover:bg-blue-100"
                    id="thisWeek"
                    checked={thisWeek}
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
                    checked={nextWeek}
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
                    checked={later}
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
                    checked={open}
                    onCheckedChange={() => updateFilter("open")}
                  />
                  <Label htmlFor="showOpen" className="ml-2 cursor-pointer text-sm">
                    Åpen for påmelding
                  </Label>
                </SidebarItemContent>
              </SidebarItem>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarItem>
      <SidebarItem className="pt-6">
        <SidebarItemContent>
          <Label
            className={cn("cursor-pointer text-base text-primary hover:text-primary-hover", {
              invisible: !filterSet,
            })}
            onClick={() => resetFilter()}
          >
            Nullstill alle filtre
          </Label>
        </SidebarItemContent>
      </SidebarItem>
    </Sidebar>
  );
}
