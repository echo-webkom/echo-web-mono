"use client";

import {useState} from "react";
import {addWeeks, isBefore, isThisWeek} from "date-fns";

import {type Bedpres} from "@/sanity/bedpres";
import {type Event} from "@/sanity/event";
import {BedpresPreview, EventPreview} from "./happening-preview-box";
import {Button} from "./ui/button";
import {Checkbox} from "./ui/checkbox";
import Input from "./ui/input";
import Label from "./ui/label";

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
      } else if (isThisWeek(addWeeks(new Date(event.date), 1))) {
        return nextWeek.push(event);
      }
    }
    return later.push(event);
  });

  return (
    <div>
      <Button variant={isAll ? "default" : "outline"} onClick={() => handleTypeChange("ALL")}>
        Alle
      </Button>
      <Button variant={isEvent ? "default" : "outline"} onClick={() => handleTypeChange("EVENT")}>
        Arrangementer
      </Button>
      <Button
        variant={isBedpres ? "default" : "outline"}
        onClick={() => handleTypeChange("BEDPRES")}
      >
        Bedriftspresentasjoner
      </Button>
      <Button variant={isPast ? "default" : "outline"} onClick={() => setIsPast((prev) => !prev)}>
        Vis tidligere
      </Button>
      <Input
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.currentTarget.value)}
        type="text"
        placeholder="Søk etter arrangement"
      />

      <div>
        {thisWeek.length > 0 && (
          <div>
            <h3>Denne uken</h3>
            {thisWeek.map((event) => (
              <ul key={event._id} className="py-3">
                {event.type === "EVENT" && <EventPreview event={event as Event} />}
                {event.type === "BEDPRES" && <BedpresPreview bedpres={event as Bedpres} />}
              </ul>
            ))}
          </div>
        )}
        {nextWeek.length > 0 && (
          <div>
            <h3>Neste uke</h3>
            {nextWeek.map((event) => (
              <ul key={event._id} className="py-3">
                {event.type === "EVENT" && <EventPreview event={event as Event} />}
                {event.type === "BEDPRES" && <BedpresPreview bedpres={event as Bedpres} />}
              </ul>
            ))}
          </div>
        )}
        {later.length > 0 && (
          <div>
            {(thisWeek.length > 0 || nextWeek.length > 0) && <h3>Senere</h3>}
            {later.map((event) => (
              <ul key={event._id} className="py-3">
                {event.type === "EVENT" && <EventPreview event={event as Event} />}
                {event.type === "BEDPRES" && <BedpresPreview bedpres={event as Bedpres} />}
              </ul>
            ))}
          </div>
        )}
        {earlier.length > 0 && isPast && (
          <div>
            <h3>Tidligere arrangementer</h3>
            {earlier.map((event) => (
              <ul key={event._id} className="py-1">
                {event.type === "EVENT" && <EventPreview event={event as Event} />}
                {event.type === "BEDPRES" && <BedpresPreview bedpres={event as Bedpres} />}
              </ul>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
