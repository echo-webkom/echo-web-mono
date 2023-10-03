"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { google, outlook, office365, yahoo, ics, type CalendarEvent } from "calendar-link";
import Link from 'next/link';
import test from 'node:test';


interface Props {
    date: Date

}

export function AddToCalender({ date }: Props) {
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
                        {google(createEvent("test", date))}
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

const createEvent = (title: string, date: Date): CalendarEvent => {
    return {
        title,
        description: "test",
        start: date,
        duration: [2, "hour"]
    }
}