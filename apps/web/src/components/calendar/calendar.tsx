"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiCalendar, BiDownload } from "react-icons/bi";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
      <Tabs value={currenetTab} className="w-full gap-2" onValueChange={handleViewChange}>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row">
          <TabsList>
            <TabsTrigger value="week">Ukekalender</TabsTrigger>
            <TabsTrigger value="month">Månedskalender</TabsTrigger>
          </TabsList>
          <Heading level={2} className="flex-1 justify-end overflow-hidden">
            {topText}
          </Heading>
          <CalendarControl
            prev={handlePrevStep}
            next={handleNextStep}
            reset={steps !== 0 ? handleReset : undefined}
          />
        </div>

        <div className="py-4">
          <TabsContent value="week">
            <DaysCalendar events={events} steps={steps} isWeek setWeekText={setTopText} />
          </TabsContent>
          <TabsContent value="month">
            <MonthCalendar events={events} steps={steps} setMonthText={setTopText} />
          </TabsContent>
          <Legend />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <BiDownload className="size-5" />
                <Text size="sm">Last ned kalender</Text>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CalendarExport />
            </DialogContent>
          </Dialog>
        </div>
      </Tabs>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex w-full gap-4">
        <Button asChild variant="ghost">
          <Link href="/for-studenter/arrangementer">
            <Heading level={2}>
              <BiCalendar />
            </Heading>
          </Link>
        </Button>
        <Heading level={2} className="flex-1 justify-end">
          {topText}
        </Heading>
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
      <Legend />
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
    <div className="flex flex-wrap gap-4 p-5 text-xs">
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
