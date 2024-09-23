"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabHeight, setTabHeight] = useState(0);

  useEffect(() => {
    setTabHeight(tabsRef.current?.scrollHeight ?? 0);
  }, [topText]);

  const handlePrevStep = () => {
    setSteps((prevSteps) => prevSteps - 1);
  };

  const handleNextStep = () => {
    setSteps((prevSteps) => prevSteps + 1);
  };

  const handleReset = () => {
    setSteps(0);
  };

  if (type === "multi") {
    return (
      <Tabs defaultValue="week" className="w-full gap-2" onValueChange={handleReset}>
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

        <motion.div animate={{ height: tabHeight }} className="overflow-hidden">
          <div ref={tabsRef} className="py-4">
            <TabsContent value="week">
              <DaysCalendar events={events} steps={steps} isWeek setWeekText={setTopText} />
            </TabsContent>
            <TabsContent value="month">
              <MonthCalendar events={events} steps={steps} setMonthText={setTopText} />
            </TabsContent>
          </div>
        </motion.div>
      </Tabs>
    );
  }

  return (
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
  );
};
