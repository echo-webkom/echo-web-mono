"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "./ui/dialog";
import { google, outlook, office365, yahoo, ics, type CalendarEvent } from "calendar-link";
import Link from 'next/link';
import test from 'node:test';
import { BiLogoGoogle } from "react-icons/bi"
import { SiYahoo, SiMicrosoftoutlook, SiMicrosoftoffice } from "react-icons/si"
import { FaFileDownload } from "react-icons/fa"




interface Props {
    date: Date,
    title: string,
}

export function AddToCalender({ date, title }: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                {date.toLocaleDateString("nb-NO")}
            </DialogTrigger>



            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pl-5">
                        Legg til i kalender 📅
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row justify-around pt-4 gap-4 sm:gap-0">
                    <CalendarButton title={title} date={date} calendarType={CalendarType.GOOGLE} />
                    <CalendarButton title={title} date={date} calendarType={CalendarType.OUTLOOK} />
                    <CalendarButton title={title} date={date} calendarType={CalendarType.OFFICE} />
                    <CalendarButton title={title} date={date} calendarType={CalendarType.YAHOO} />
                    <CalendarButton title={title} date={date} calendarType={CalendarType.ICS} />
                </div>

            </DialogContent>


        </Dialog>)
};

enum CalendarType {
    GOOGLE = "Google",
    OUTLOOK = "Outlook",
    OFFICE = "Office",
    YAHOO = "Yahoo",
    ICS = "Ics",
}


interface CalendarButtonProps {
    title: string,
    date: Date,
    calendarType: CalendarType,
}

const CalendarButton = ({ title, date, calendarType }: CalendarButtonProps) => {
    const event: CalendarEvent = {
        title,
        description: "",
        start: date,
        duration: [2, "hour"]
    }
    let calendarFunc = getCalendarFunc(calendarType)
    const link = calendarFunc(event)
    const iconClassNames = "h-8 w-8"
    return (
        <a href={link} target="_blank">
            <div className="flex flex-col sm:gap-4 py-3 sm:py-0 bg-gray-100 sm:bg-transparent rounded-sm">


                <div className="mx-auto">
                    {CalendarType.GOOGLE === calendarType && <BiLogoGoogle className={iconClassNames} />}
                    {CalendarType.OUTLOOK === calendarType && <SiMicrosoftoutlook className={iconClassNames} />}
                    {CalendarType.OFFICE === calendarType && <SiMicrosoftoffice className={iconClassNames} />}
                    {CalendarType.YAHOO === calendarType && <SiYahoo className={iconClassNames} />}
                    {CalendarType.ICS === calendarType && <FaFileDownload className={iconClassNames} />}
                </div>
                <p className="text-center">{calendarType}</p>
            </div>
        </a>

    )
}

const getCalendarFunc = (calendarType: CalendarType) => {
    switch (calendarType) {
        case CalendarType.GOOGLE: return google;
        case CalendarType.OUTLOOK: return outlook;
        case CalendarType.OFFICE: return office365;
        case CalendarType.YAHOO: return yahoo;
        case CalendarType.ICS: return ics;
        default: throw new Error("Could not recognize calendar type");
    }
}
