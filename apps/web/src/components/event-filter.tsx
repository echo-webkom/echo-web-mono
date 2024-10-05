"use client";

import { useEffect, useState } from "react";
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import {
  LuArrowDownNarrowWide as ArrowDownNarrowWide,
  LuChevronDown as ChevronDown,
  LuChevronRight as ChevronRight,
} from "react-icons/lu";

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
import { Label } from "./ui/label";
import { SearchInput } from "./ui/search-input";

type FilterType =
  | "ALL"
  | "EVENT"
  | "BEDPRES"
  | "SEARCH"
  | "DESC"
  | "PAST"
  | "OPEN"
  | "THIS_WEEK"
  | "NEXT_WEEK"
  | "LATER";

type UpdateType = {
  type: FilterType;
  condition?: boolean;
  search?: string;
};
export const updateFilter = (
  updates: Array<UpdateType> | UpdateType | FilterType,
  router: AppRouterInstance,
  pathname: string,
  params: ReadonlyURLSearchParams,
) => {
  const searchParams = new URLSearchParams(params);

  if (!Array.isArray(updates)) {
    if (typeof updates === "string") {
      updates = [{ type: updates }];
    } else {
      updates = [updates];
    }
  }

  updates.forEach(({ type, condition, search }) => {
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
      case "SEARCH":
        search ? searchParams.set("search", search) : searchParams.delete("search");
        break;
      case "DESC":
        condition ? searchParams.delete("order") : searchParams.set("order", "DESC");
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
  });
  router.push(`${pathname}?${searchParams}`, { scroll: false });
};

export const EventFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const type =
    params.get("type") === "event" ? "EVENT" : params.get("type") === "bedpres" ? "BEDPRES" : "ALL";

  const getButtonLabel = (type: FilterType) => {
    switch (type) {
      case "ALL":
        return "Alle";
      case "EVENT":
        return "Arrangementer";
      case "BEDPRES":
        return "Bedriftspresentasjoner";
    }
  };

  const firstButton = type === "ALL" ? "EVENT" : "ALL";
  const secondButton = type === "BEDPRES" ? "EVENT" : "BEDPRES";

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="flex flex-col items-center sm:hidden">
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="w-full" asChild>
            <Button fullWidth className="flex justify-between">
              {getButtonLabel(type)}{" "}
              {isOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full sm:hidden">
            <DropdownMenuItem className="w-full text-base">
              <Button
                fullWidth
                variant="ghost"
                onClick={() => updateFilter(firstButton, router, pathname, params)}
              >
                {getButtonLabel(firstButton)}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full text-base">
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
};

export const FilterStatusAndOrderBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const asc = params.get("order") === "DESC" ? true : false;

  const filterSet =
    params.has("order") ||
    params.has("search") ||
    params.has("open") ||
    params.has("past") ||
    params.has("thisWeek") ||
    params.has("nextWeek") ||
    params.has("later");

  const resetFilter = () => {
    const searchParams = new URLSearchParams();
    const type = params.get("type");
    if (type === "bedpres" || type === "event") searchParams.set("type", type);
    router.push(`${pathname}?${searchParams}`, { scroll: false });
  };

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
          onClick={() => updateFilter({ type: "DESC", condition: asc }, router, pathname, params)}
        />
      </span>
    </div>
  );
};

export const EventFilterSidebar = () => {
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

  /**
   * This useEffect sets the search input to the value in the URL when the user navigates back, etc.
   */
  const paramSearch = params.get("search") ?? "";
  useEffect(() => {
    setSearchInput(paramSearch);
  }, [paramSearch]);

  return (
    <Sidebar className="space-y-3">
      <SidebarItem>
        <SidebarItemContent className="flex items-center justify-center">
          <SearchInput
            value={searchInput}
            onClear={() => setSearchInput("")}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
                updateFilter({ type: "SEARCH", search: searchInput }, router, pathname, params);
              }
            }}
            placeholder="Søk..."
            className="w-full"
          />
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
              onCheckedChange={() =>
                updateFilter({ type: "THIS_WEEK", condition: thisWeek }, router, pathname, params)
              }
            />
            <Label htmlFor="thisWeek" className="ml-2 cursor-pointer text-base">
              Denne uken
            </Label>
          </SidebarItemContent>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="nextWeek"
              checked={nextWeek}
              onCheckedChange={() =>
                updateFilter({ type: "NEXT_WEEK", condition: nextWeek }, router, pathname, params)
              }
            />
            <Label htmlFor="nextWeek" className="ml-2 cursor-pointer text-base">
              Neste uke
            </Label>
          </SidebarItemContent>

          <SidebarItemContent className="flex items-center">
            <Checkbox
              className="hover:bg-muted"
              id="later"
              checked={later}
              onCheckedChange={() =>
                updateFilter({ type: "LATER", condition: later }, router, pathname, params)
              }
            />
            <Label htmlFor="later" className="ml-2 cursor-pointer text-base">
              Senere
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
              onCheckedChange={() => {
                updateFilter(
                  [
                    { type: "PAST", condition: past },
                    { type: "DESC", condition: past },
                  ],
                  router,
                  pathname,
                  params,
                );
              }}
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
              onCheckedChange={() =>
                updateFilter({ type: "OPEN", condition: open }, router, pathname, params)
              }
            />
            <Label htmlFor="showOpen" className="ml-2 cursor-pointer text-base">
              Åpen for påmelding
            </Label>
          </SidebarItemContent>
        </SidebarItem>
      </SidebarItem>
    </Sidebar>
  );
};
