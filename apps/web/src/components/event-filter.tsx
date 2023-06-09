"use client";

import {useState} from "react";
import {addWeeks, isBefore, isThisWeek, isWithinInterval, nextMonday} from "date-fns";

import {type Bedpres} from "@/sanity/bedpres";
import {type Event} from "@/sanity/event";
import {BedpresPreview, EventPreview} from "./happening-preview-box";
import {Button} from "./ui/button";
import Input from "./ui/input";

type EventsProps = {
  events: Array<
    | (Event & {
        type: "EVENT";
      })
    | (Bedpres & {
        type: "BEDPRES";
      })
  >;
};

export default function Events({events}: EventsProps) {
  const [searchTitle, setSearchTitle] = useState("");
  const [isAll, setIsAll] = useState(true);
  const [isBedpres, setIsBedpres] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [isPast, setIsPast] = useState(false);

  const handleTypeChange = (type: string) => {
    setIsAll(type === "ALL");
    setIsBedpres(type === "BEDPRES");
    setIsEvent(type === "EVENT");
  };

  const currentDate = new Date();

  const filteredEvents = events
    .filter((event) => {
      if (event.type === "EVENT" && (isEvent || isAll)) {
        return event.title.toLowerCase().includes(searchTitle.toLowerCase());
      }
      if (event.type === "BEDPRES" && (isBedpres || isAll)) {
        return event.title.toLowerCase().includes(searchTitle.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

  const earlier: typeof filteredEvents = [];
  const thisWeek: typeof filteredEvents = [];
  const nextWeek: typeof filteredEvents = [];
  const later: typeof filteredEvents = [];

  filteredEvents.forEach((event) => {
    if (event.date) {
      if (isBefore(new Date(event.date), currentDate)) {
        return earlier.push(event);
      } else if (isThisWeek(new Date(event.date))) {
        return thisWeek.push(event);
      } else if (
        isWithinInterval(new Date(event.date), {
          start: nextMonday(currentDate),
          end: nextMonday(nextMonday(currentDate)),
        })
      ) {
        return nextWeek.push(event);
      }
    }
    return later.push(event);
  });

  later.forEach((event) => {
    console.log(event.title);
  });
  console.log(`later length: ${later.length}`);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b-2 border-solid border-gray-400 border-opacity-20 pb-10">
        <div className="space-x-3">
          <Button variant={isAll ? "default" : "outline"} onClick={() => handleTypeChange("ALL")}>
            Alle
          </Button>
          <Button
            variant={isEvent ? "default" : "outline"}
            onClick={() => handleTypeChange("EVENT")}
          >
            Arrangementer
          </Button>
          <Button
            variant={isBedpres ? "default" : "outline"}
            onClick={() => handleTypeChange("BEDPRES")}
          >
            Bedriftspresentasjoner
          </Button>
        </div>
        <div>
          <Button
            variant={isPast ? "default" : "outline"}
            onClick={() => setIsPast((prev) => !prev)}
          >
            Se tidligere
          </Button>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex w-1/4 flex-col pt-5">
          <div className="p-5">
            <Input
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.currentTarget.value)}
              type="text"
              placeholder="Søk etter arrangement"
            />
          </div>
        </div>
        <div className="w-3/4">
          {thisWeek.length > 0 && !isPast && (
            <div>
              <div className="p-5 text-3xl">Denne uken</div>
              {thisWeek.map((event) => (
                <ul key={event._id} className="py-3">
                  {event.type === "EVENT" && <EventPreview event={event as Event} />}
                  {event.type === "BEDPRES" && (
                    <BedpresPreview bedpres={event as Bedpres} alignImageRight={true} />
                  )}
                </ul>
              ))}
            </div>
          )}
          {nextWeek.length > 0 && !isPast && (
            <div>
              <div className="p-5 text-3xl">Neste uke</div>
              {nextWeek.map((event) => (
                <ul key={event._id} className="py-3">
                  {event.type === "EVENT" && <EventPreview event={event as Event} />}
                  {event.type === "BEDPRES" && (
                    <BedpresPreview bedpres={event as Bedpres} alignImageRight={true} />
                  )}
                </ul>
              ))}
            </div>
          )}
          {later.length > 0 && !isPast && (
            <div>
              {(thisWeek.length > 0 || nextWeek.length > 0) && (
                <div className="p-5 text-3xl">Senere</div>
              )}
              {later.map((event) => (
                <ul key={event._id} className="py-3">
                  {event.type === "EVENT" && <EventPreview event={event as Event} />}
                  {event.type === "BEDPRES" && (
                    <BedpresPreview bedpres={event as Bedpres} alignImageRight={true} />
                  )}
                </ul>
              ))}
            </div>
          )}
          {earlier.length > 0 && isPast && (
            <div>
              <div className="p-5 pt-10 text-3xl">Tidligere</div>
              {earlier.map((event) => (
                <ul key={event._id} className="py-1">
                  {event.type === "EVENT" && <EventPreview event={event as Event} />}
                  {event.type === "BEDPRES" && (
                    <BedpresPreview bedpres={event as Bedpres} alignImageRight={true} />
                  )}
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
