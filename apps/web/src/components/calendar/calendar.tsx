"use client";

import { Calendar as CalendarIcon, Download } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";

import { CalendarControl } from "./calendar-control";
import { CalendarExport } from "./calendar-export";
import { DaysCalendar } from "./days-calendar";
import { MonthCalendar } from "./month-calendar";

const STEP_PARAM_NAME = "step";
const TAB_PARAM_NAME = "view";

type CalendarTabType = "week" | "month";

type CalendarProps = {
  events: Array<CalendarEvent>;
  type: CalendarTabType | "multi";
};

export const Calendar = ({ events, type }: CalendarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [topText, setTopText] = useState("Kalender");
  const [steps, setSteps] = useState(() => parseStepParam(searchParams));
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
      <div className="bg-card overflow-hidden rounded-md border shadow-sm">
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
            />
          </div>

          <TabsContent value="week">
            <DaysCalendar events={events} steps={steps} isWeek setWeekText={setTopText} />
          </TabsContent>
          <TabsContent value="month">
            <MonthCalendar events={events} steps={steps} setMonthText={setTopText} />
          </TabsContent>

          <div className="flex items-center gap-4 border-t px-4 py-3">
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
            <Legend />
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center gap-2 border-b px-4 py-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/for-studenter/arrangementer">
            <CalendarIcon className="size-4" />
          </Link>
        </Button>
        <span className="flex-1 text-sm font-semibold capitalize">{topText}</span>
        <Legend />
        <CalendarControl
          prev={handlePrevStep}
          next={handleNextStep}
          reset={steps !== 0 ? handleReset : undefined}
        />
      </div>
      {type === "week" ? (
        <DaysCalendar events={events} steps={steps} isWeek setWeekText={setTopText} />
      ) : (
        <MonthCalendar events={events} steps={steps} setMonthText={setTopText} />
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

const Legend = () => {
  return (
    <div className="hidden flex-wrap gap-3 text-xs sm:flex">
      <div className="mr-2 flex items-center">
        <div className="bg-primary mr-1 h-3 w-3 rounded-full"></div>
        <div>Bedpres</div>
      </div>
      <div className="mr-2 flex items-center">
        <div className="bg-secondary mr-1 h-3 w-3 rounded-full"></div>
        <div>Arrangement</div>
      </div>
      <div className="mr-2 flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-pink-400"></div>
        <div>Film</div>
      </div>
      <div className="mr-2 flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-green-600"></div>
        <div>Brettspill</div>
      </div>
      <div className="flex items-center">
        <div className="mr-1 h-3 w-3 rounded-full bg-gray-600"></div>
        <div>Annet</div>
      </div>
    </div>
  );
};
