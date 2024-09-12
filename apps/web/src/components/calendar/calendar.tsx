"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CalendarEvent } from "@/lib/calendar-event-helpers";
import { Heading } from "../typography/heading";
import { CalendarControl } from "./calendar-control";
import { DaysCalendar } from "./days-calendar";
import { MonthCalendar } from "./month-calendar";

type Props = {
  events: Array<CalendarEvent>;
};

export const Calendar = ({ events }: Props) => {
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
    <div>
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
    </div>
  );
};
