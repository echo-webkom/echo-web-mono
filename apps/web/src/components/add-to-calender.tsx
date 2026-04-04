"use client";

import { CalendarDays, FileDown, Mail } from "lucide-react";

import {
  type CalendarEvent,
  googleCalendarLink,
  icsCalendarLink,
  outlookCalendarLink,
} from "@/lib/calendar-links";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  date: Date;
  endDate?: Date;
  title: string;
  children?: React.ReactNode;
};

export const AddToCalender = ({ date, endDate, title, children }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="rounded text-left hover:underline">{children}</DialogTrigger>

      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="pl-5">Legg til i kalender 📅</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col justify-around gap-4 sm:flex-row sm:gap-0">
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Google" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Outlook" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Ics" />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

type CalendarType = "Google" | "Outlook" | "Ics";

type CalendarButtonProps = {
  title: string;
  date: Date;
  endDate?: Date;
  calendarType: CalendarType;
};

const CalendarButton = ({ title, date, endDate, calendarType }: CalendarButtonProps) => {
  const event = {
    title,
    description: "",
    start: date,
    end: endDate,
  } satisfies CalendarEvent;
  const link = getCalendarLink(calendarType, event);
  const iconClassNames = "h-8 w-8";
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="bg-background flex flex-col rounded-sm py-3 sm:gap-4 sm:py-0">
        <div className="mx-auto">
          {"Google" === calendarType && <CalendarDays className={iconClassNames} />}
          {"Outlook" === calendarType && <Mail className={iconClassNames} />}
          {"Ics" === calendarType && <FileDown className={iconClassNames} />}
        </div>
        <p className="text-center">{calendarType}</p>
      </div>
    </a>
  );
};

const getCalendarLink = (calendarType: CalendarType, event: CalendarEvent): string => {
  switch (calendarType) {
    case "Google":
      return googleCalendarLink(event);
    case "Outlook":
      return outlookCalendarLink(event);
    case "Ics":
      return icsCalendarLink(event);
    default:
      return icsCalendarLink(event);
  }
};
