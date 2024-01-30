"use client";

import { useEffect, useState } from "react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { LuArrowDownNarrowWide as ArrowDownNarrowWide } from "react-icons/lu";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/utils/cn";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FilterType =
  | "ALL"
  | "EVENT"
  | "BEDPRES"
  | "ASC"
  | "THIS_WEEK"
  | "NEXT_WEEK"
  | "LATER"
  | "PAST"
  | "OPEN";

function updateFilter(
  type: FilterType,
  router: AppRouterInstance,
  pathname: string,
  params: ReadonlyURLSearchParams,
  condition?: boolean,
) {
  const searchParams = new URLSearchParams(params);

  switch (type) {
    case "ALL":
      searchParams.delete("type");
      break;
    case "EVENT":
      searchParams.set("type", "event");
      break;
    case "BEDPRES":
      searchParams.set("type", "bedpres");
      break;
    case "ASC":
      condition ? searchParams.delete("order") : searchParams.set("order", "ASC");
      break;
    case "THIS_WEEK":
      condition ? searchParams.set("thisWeek", "false") : searchParams.delete("thisWeek");
      break;
    case "NEXT_WEEK":
      condition ? searchParams.set("nextWeek", "false") : searchParams.delete("nextWeek");
      break;
    case "LATER":
      condition ? searchParams.set("later", "false") : searchParams.delete("later");
      break;
    case "OPEN":
      condition ? searchParams.delete("open") : searchParams.set("open", "true");
      break;
    case "PAST":
      condition ? searchParams.delete("past") : searchParams.set("past", "true");
      break;
  }
  router.push(`${pathname}?${searchParams}`, { scroll: false });
}

export function EventFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const type =
    params.get("type") === "event" ? "EVENT" : params.get("type") === "bedpres" ? "BEDPRES" : "ALL";

  function getButtonLabel(type: FilterType) {
    switch (type) {
      case "ALL":
        return "Alle";
      case "EVENT":
        return "Arrangementer";
      case "BEDPRES":
        return "Bedriftspresentasjoner";
    }
  }

  const firstButton = type === "ALL" ? "EVENT" : "ALL";
  const secondButton = type === "BEDPRES" ? "EVENT" : "BEDPRES";

  return (
    <>
      <div className="flex flex-col items-center sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-96">
            <Button fullWidth>{getButtonLabel(type)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="sm:hidden">
            <DropdownMenuItem className="w-96 text-base">
              <Button
                fullWidth
                variant="ghost"
                onClick={() => updateFilter(firstButton, router, pathname, params)}
              >
                {getButtonLabel(firstButton)}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="w-96 text-base">
              <Button
                fullWidth
                variant="ghost"
                onClick={() => updateFilter(secondButton, router, pathname, params)}
              >
                {getButtonLabel(secondButton)}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden sm:flex sm:flex-row sm:space-x-2">
        <Button
          className="w-auto"
          variant={type === "ALL" ? "default" : "outline"}
          onClick={() => updateFilter("ALL", router, pathname, params)}
        >
          Alle
        </Button>
        <Button
          className="w-auto"
          variant={type === "EVENT" ? "default" : "outline"}
          onClick={() => updateFilter("EVENT", router, pathname, params)}
        >
          Arrangementer
        </Button>
        <Button
          className="w-auto"
          variant={type === "BEDPRES" ? "default" : "outline"}
          onClick={() => updateFilter("BEDPRES", router, pathname, params)}
        >
          Bedriftspresentasjoner
        </Button>
      </div>
    </>
  );
}

export function FilterStatusAndOrderBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const asc = params.get("order") === "ASC" ? true : false;

  const filterSet =
    params.has("order") ||
    params.has("search") ||
    params.has("open") ||
    params.has("past") ||
    params.has("thisWeek") ||
    params.has("nextWeek") ||
    params.has("later");

  function resetFilter() {
    const searchParams = new URLSearchParams();
    const type = params.get("type");
    if (type === "bedpres" || type === "event") searchParams.set("type", type);
    router.push(`${pathname}?${searchParams}`, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between">
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn("rounded-full text-sm", {
          invisible: !filterSet,
        })}
        onClick={() => resetFilter()}
      >
        Tøm alle filtre
      </Button>

      <span>
        <ArrowDownNarrowWide
          className={cn("mr-2 h-6 w-6 cursor-pointer transition duration-200 ease-in-out", {
            "rotate-180 transform": asc,
          })}
          onClick={() => updateFilter("ASC", router, pathname, params, asc)}
        />
      </span>
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

  const { thisWeek, nextWeek, later, open, past } = {
    thisWeek: params.get("thisWeek") === "false" ? false : true,
    nextWeek: params.get("nextWeek") === "false" ? false : true,
    later: params.get("later") === "false" ? false : true,
    open: params.get("open") === "true" ? true : false,
    past: params.get("past") === "true" ? true : false,
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

  return (
    <Sidebar className="space-y-3 ">
      <SidebarItem>
        <SidebarItemContent className="flex items-center justify-center">
          <div className="relative flex w-96 rounded-lg border border-gray-300 hover:border-gray-500 sm:w-full">
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
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItem className="mb-5 space-y-2">
          <SidebarItemTitle className="mb-3">Tidspunkt:</SidebarItemTitle>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="thisWeek"
              checked={thisWeek}
              onCheckedChange={() => updateFilter("THIS_WEEK", router, pathname, params, thisWeek)}
            />
            <Label htmlFor="thisWeek" className="ml-2 cursor-pointer text-base">
              Denne uken ({numThisWeek})
            </Label>
          </SidebarItemContent>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="nextWeek"
              checked={nextWeek}
              onCheckedChange={() => updateFilter("NEXT_WEEK", router, pathname, params, nextWeek)}
            />
            <Label htmlFor="nextWeek" className="ml-2 cursor-pointer text-base">
              Neste uke ({numNextWeek})
            </Label>
          </SidebarItemContent>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="later"
              checked={later}
              onCheckedChange={() => updateFilter("LATER", router, pathname, params, later)}
            />
            <Label htmlFor="later" className="ml-2 cursor-pointer text-base">
              Senere ({numLater})
            </Label>
          </SidebarItemContent>
        </SidebarItem>
        <SidebarItem className="mb-5 space-y-2">
          <SidebarItemTitle className="mb-3">Vis kun:</SidebarItemTitle>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="showPast"
              checked={past}
              onCheckedChange={() => updateFilter("PAST", router, pathname, params, past)}
            />
            <Label htmlFor="showPast" className="ml-2 cursor-pointer text-base">
              Tidligere
            </Label>
          </SidebarItemContent>
          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="showOpen"
              checked={open}
              onCheckedChange={() => updateFilter("OPEN", router, pathname, params, open)}
            />
            <Label htmlFor="showOpen" className="ml-2 cursor-pointer text-base">
              Åpen for påmelding
            </Label>
          </SidebarItemContent>
        </SidebarItem>
      </SidebarItem>
    </Sidebar>
  );
}
