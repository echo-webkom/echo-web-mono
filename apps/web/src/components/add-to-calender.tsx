"use client";

import { google, ics, outlook, yahoo, type CalendarEvent } from "calendar-link";
import { BiLogoGoogle } from "react-icons/bi";
import { FaFileDownload, FaYahoo } from "react-icons/fa";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";

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
      <DialogTrigger className="text-left hover:underline">{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pl-5">Legg til i kalender 📅</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col justify-around gap-4 sm:flex-row sm:gap-0">
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Google" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Outlook" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Office" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Yahoo" />
          <CalendarButton title={title} date={date} endDate={endDate} calendarType="Ics" />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

type CalendarType = "Google" | "Outlook" | "Office" | "Yahoo" | "Ics";

type CalendarButtonProps = {
  title: string;
  date: Date;
  endDate?: Date;
  calendarType: CalendarType;
};

const CalendarButton = ({ title, date, endDate, calendarType }: CalendarButtonProps) => {
  const event: CalendarEvent = {
    title,
    description: "",
    start: date,
    end: endDate,
    duration: endDate ? undefined : [2, "hour"],
  };
  const link = getCalendarLink(calendarType, event);
  const iconClassNames = "h-8 w-8";
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <div className="flex flex-col rounded-sm bg-gray-100 py-3 sm:gap-4 sm:bg-transparent sm:py-0">
        <div className="mx-auto">
          {"Google" === calendarType && <BiLogoGoogle className={iconClassNames} />}
          {"Outlook" === calendarType && <PiMicrosoftOutlookLogo className={iconClassNames} />}
          {"Yahoo" === calendarType && <FaYahoo className={iconClassNames} />}
          {"Ics" === calendarType && <FaFileDownload className={iconClassNames} />}
        </div>
        <p className="text-center">{calendarType}</p>
      </div>
    </a>
  );
};

const getCalendarLink = (calendarType: CalendarType, event: CalendarEvent): string => {
  switch (calendarType) {
    case "Google":
      return google(event);
    case "Outlook":
      return outlook(event);
    case "Yahoo":
      return yahoo(event);
    case "Ics":
      return ics(event);
    default:
      return ics(event);
  }
};
