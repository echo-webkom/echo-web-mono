"use client";

import * as Dialog from '@radix-ui/react-dialog';
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
        <Dialog.Root>
            <Dialog.Trigger>
                <button>
                    {date.toLocaleDateString("nb-NO")}
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                        Legg til i kalender 📅
                    </Dialog.Title>
                    <Dialog.Content className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                        <CalendarButton title={title} date={date} calendarType={CalendarType.GOOGLE} />
                        <CalendarButton title={title} date={date} calendarType={CalendarType.OUTLOOK} />
                        <CalendarButton title={title} date={date} calendarType={CalendarType.OFFICE} />
                        <CalendarButton title={title} date={date} calendarType={CalendarType.YAHOO} />
                        <CalendarButton title={title} date={date} calendarType={CalendarType.ICS} />
                    </Dialog.Content>

                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            x
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>)
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
    return (
        <a href={link}>
            {CalendarType.GOOGLE === calendarType && <BiLogoGoogle />}
            {CalendarType.OUTLOOK === calendarType && <SiMicrosoftoutlook />}
            {CalendarType.OFFICE === calendarType && <SiMicrosoftoffice />}
            {CalendarType.YAHOO === calendarType && <SiYahoo />}
            {CalendarType.ICS === calendarType && <FaFileDownload />}
            <p>{calendarType}</p>
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
