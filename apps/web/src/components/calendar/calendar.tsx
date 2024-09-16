"use client";

import { useState } from "react";
import Link from "next/link";
import { BiCalendar } from "react-icons/bi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { Heading } from "../typography/heading";
import { Button } from "../ui/button";
import { CalendarControl } from "./calendar-control";
import { DaysCalendar } from "./days-calendar";
import { MonthCalendar } from "./month-calendar";

type Props = {
  events: Array<CalendarEvent>;
  type: "week" | "month" | "multi";
};

export const Calendar = ({ events, type }: Props) => {
  const [steps, setSteps] = useState(0);
  const [topText, setTopText] = useState("");

  const handlePrevStep = () => {
    setSteps((prevSteps) => prevSteps - 1);
  };

  const handleNextStep = () => {
    setSteps((prevSteps) => prevSteps + 1);
  };

  const handleReset = () => {
    setSteps(0);
  };

  return (
    <>
      {type !== "multi" ? (
        <div>
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
        </div>
      ) : (
        <Tabs defaultValue="week" className="w-full gap-2">
          <div className="flex w-full gap-4">
            <TabsList className="">
              <TabsTrigger value="week">Ukekalender</TabsTrigger>
              <TabsTrigger value="month">Månedskalender</TabsTrigger>
            </TabsList>
            <Heading level={2} className="flex-1 justify-end">
              {topText}
            </Heading>
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
        </Tabs>
      )}
    </>
  );
};
