"use client";

import { Calendar as CalendarIcon, Download, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { type CalendarEvent, type CalendarEventType } from "@/lib/calendar-event-helpers";
import { cn } from "@/utils/cn";

import { CalendarControl } from "./calendar-control";
import { CalendarExport } from "./calendar-export";
import { DaysCalendar } from "./days-calendar";
import { MonthCalendar } from "./month-calendar";

const STEP_PARAM_NAME = "step";
const TAB_PARAM_NAME = "view";

const ALL_TYPES: Array<CalendarEventType> = ["bedpres", "event", "movie", "boardgame", "other"];

const LEGEND_ITEMS: Array<{
  type: CalendarEventType;
  label: string;
  bgClass: string;
  borderClass: string;
}> = [
  { type: "bedpres", label: "Bedpres", bgClass: "bg-primary", borderClass: "border-primary" },
  { type: "event", label: "Arrangement", bgClass: "bg-secondary", borderClass: "border-secondary" },
  {
    type: "boardgame",
    label: "Brettspill",
    bgClass: "bg-green-600",
    borderClass: "border-green-600",
  },
  { type: "other", label: "Annet", bgClass: "bg-gray-600", borderClass: "border-gray-600" },
];

type CalendarTabType = "week" | "month";

type CalendarProps = {
  events: Array<CalendarEvent>;
  type: CalendarTabType | "multi";
};

const SHOW_LONG_EVENTS_KEY = "showLongEvents";

export const Calendar = ({ events, type }: CalendarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useIsMounted();

  const [topText, setTopText] = useState("Kalender");
  const [steps, setSteps] = useState(() => parseStepParam(searchParams));
  const [activeTypes, setActiveTypes] = useState<Set<CalendarEventType>>(new Set(ALL_TYPES));
  const [showLongEvents, setLongEvents] = useState(
    isMounted ? localStorage.getItem(SHOW_LONG_EVENTS_KEY) === "true" : false,
  );
  const [showOptionsModal, setOptionsModal] = useState(false);

  const toggleLongEvents = () => {
    setLongEvents((b) => {
      localStorage.setItem(SHOW_LONG_EVENTS_KEY, !b ? "true" : "false");
      return !b;
    });
  };

  const toggleOptionsModal = () => setOptionsModal((b) => !b);

  const options = [
    // Show/hide events spanning multiple days. Always shows the first one.
    <ToggleWithText
      key={0}
      active={showLongEvents}
      toggle={toggleLongEvents}
      text="Vis arrangementer over flere dager"
    />,
    // Export calendar to ics
    <ExportCalendarButton key={1} />,
  ];

  const toggleType = (type: CalendarEventType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const filteredEvents = useMemo(
    () => events.filter((e) => activeTypes.has(e.type)),
    [events, activeTypes],
  );
  const [currenetTab, currentTab] = useState<CalendarTabType>(() =>
    searchParams.get(TAB_PARAM_NAME) === "month" ? "month" : "week",
  );

  const handlePrevStep = () => {
    setSteps((prev) => prev - 1);
  };

  const handleNextStep = () => {
    setSteps((prev) => prev + 1);
  };

  const handleReset = () => {
    setSteps(0);
  };

  const handleViewChange = (value: string) => {
    const next = value === "month" ? "month" : "week";

    if (type !== "multi") return;
    if (next === currenetTab) return;

    handleReset();
    currentTab(next);
  };

  const onCalendarChange = useEffectEvent(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update step param
    if (steps === 0) {
      params.delete(STEP_PARAM_NAME);
    } else {
      params.set(STEP_PARAM_NAME, steps.toString());
    }

    // Update tab param
    if (type === "multi") {
      params.set(TAB_PARAM_NAME, currenetTab);
    } else {
      params.delete(TAB_PARAM_NAME);
    }

    const paramsString = params.toString();
    router.replace(paramsString ? `${pathname}?${paramsString}` : pathname);
  });

  useEffect(() => {
    onCalendarChange();
  }, [steps, currenetTab]);

  if (type === "multi") {
    return (
      <div className="bg-card relative overflow-hidden rounded-md border shadow-sm">
        <OptionsModal items={options} close={toggleOptionsModal} isOpen={showOptionsModal} />
        <Tabs value={currenetTab} className="w-full" onValueChange={handleViewChange}>
          <div className="flex w-full items-center gap-3 border-b px-4 py-2">
            <TabsList>
              <TabsTrigger value="week">Uke</TabsTrigger>
              <TabsTrigger value="month">Måned</TabsTrigger>
            </TabsList>
            <span className="flex-1 text-sm font-semibold capitalize">{topText}</span>
            <CalendarControl
              prev={handlePrevStep}
              next={handleNextStep}
              reset={steps !== 0 ? handleReset : undefined}
              toggleOptions={toggleOptionsModal}
            />
          </div>

          <TabsContent value="week">
            <DaysCalendar
              events={filteredEvents}
              steps={steps}
              isWeek
              setWeekText={setTopText}
              showLongEvents={showLongEvents}
            />
          </TabsContent>
          <TabsContent value="month">
            <MonthCalendar events={filteredEvents} steps={steps} setMonthText={setTopText} />
          </TabsContent>

          <div className="flex items-center gap-4 border-t px-4 py-3">
            <Legend activeTypes={activeTypes} onToggle={toggleType} />
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      <OptionsModal items={options} close={toggleOptionsModal} isOpen={showOptionsModal} />
      <div className="flex w-full items-center justify-between border-b px-4 py-3">
        <div className="flex gap-6">
          <div className="flex items-center justify-center">
            <Button variant="outline" size="icon" asChild>
              <Link href="/for-studenter/arrangementer">
                <CalendarIcon className="size-4" />
              </Link>
            </Button>
            <span className="flex-1 pl-2 text-sm font-semibold capitalize">{topText}</span>
          </div>
          <div className="hidden border border-y-0 border-l-0 p-1 sm:block"></div>
          <Legend activeTypes={activeTypes} onToggle={toggleType} />
        </div>
        <CalendarControl
          prev={handlePrevStep}
          next={handleNextStep}
          reset={steps !== 0 ? handleReset : undefined}
          toggleOptions={toggleOptionsModal}
        />
      </div>
      {type === "week" ? (
        <DaysCalendar
          events={filteredEvents}
          steps={steps}
          isWeek
          setWeekText={setTopText}
          showLongEvents={showLongEvents}
        />
      ) : (
        <MonthCalendar events={filteredEvents} steps={steps} setMonthText={setTopText} />
      )}
    </div>
  );
};

function parseStepParam(params: URLSearchParams) {
  const value = params.get(STEP_PARAM_NAME);
  if (!value) {
    return 0;
  }

  const v = parseInt(value, 10);
  if (isNaN(v)) {
    return 0;
  }

  return v;
}

type LegendProps = {
  activeTypes: Set<CalendarEventType>;
  onToggle: (type: CalendarEventType) => void;
};

const Legend = ({ activeTypes, onToggle }: LegendProps) => {
  return (
    <div className="hidden flex-wrap gap-2 text-xs sm:flex">
      {LEGEND_ITEMS.map(({ type, label, bgClass, borderClass }) => {
        const active = activeTypes.has(type);
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className="group flex cursor-pointer items-center gap-1"
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full border transition-colors",
                borderClass,
                active ? bgClass : "bg-transparent",
              )}
            />
            <span
              className={cn("transition-opacity group-hover:underline", !active && "opacity-40")}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

type OptionsModalProps = {
  items: Array<React.ReactNode>;
  isOpen: boolean;
  close: () => void;
};

const OptionsModal = ({ items, close, isOpen }: OptionsModalProps) => {
  return (
    <>
      <div
        className={cn(
          "bg-accent absolute top-0 z-1 flex h-full flex-col gap-4 items-start rounded border border-y-0 border-r-0 p-3 px-4 shadow transition-all sm:w-sm w-full",
          isOpen ? "right-0" : "-right-[100vw]",
        )}
      >
        <div className="flex w-full items-center justify-between border-b pb-4">
          <p className="">Kalenderinstillinger</p>
          <Button variant="outline" size="icon" onClick={close}>
            <X className="size-4" />
          </Button>
        </div>
        {items.map((item, _) => item)}
      </div>
    </>
  );
};

type ToggleWithTextProps = {
  active: boolean;
  toggle: () => void;
  text: string;
};

const ToggleWithText = ({ active, toggle, text }: ToggleWithTextProps) => {
  return (
    <div className="grid w-full grid-cols-2 items-center">
      <p className="text-muted-foreground text-sm text-wrap">{text}</p>
      <div className="flex w-full justify-end">
        <button
          onClick={toggle}
          className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
            active ? "bg-primary" : "bg-muted-dark"
          }`}
        >
          <span
            className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
              active ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const ExportCalendarButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="size-4" />
          <Text size="sm">Last ned kalender</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Last ned kalender</DialogTitle>
        <CalendarExport />
      </DialogContent>
    </Dialog>
  );
};
