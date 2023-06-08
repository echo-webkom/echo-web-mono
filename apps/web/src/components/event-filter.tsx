"use client";

import {useState} from "react";
import {addWeeks, isBefore, isThisWeek} from "date-fns";
import nextThursday from "date-fns/nextThursday";

import {type Bedpres} from "@/sanity/bedpres";
import {type Event} from "@/sanity/event";
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
  const [isBedpres, setIsBedpres] = useState(true);
  const [isEvent, setIsEvent] = useState(true);
  const [isPast, setIsPast] = useState(false);

  const filteredEvents = events
    .filter((event) => {
      if (event.type === "EVENT" && isEvent) {
        return event.title.toLowerCase().includes(searchTitle.toLowerCase());
      }
      if (event.type === "BEDPRES" && isBedpres) {
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
      const currentDate = new Date();

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
      <Input
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.currentTarget.value)}
        type="text"
        placeholder="Søk etter arrangement"
      />
      <Checkbox checked={isEvent} onCheckedChange={() => setIsEvent((prev) => !prev)} />
      <Label>Arrangement</Label>
      <Checkbox checked={isBedpres} onCheckedChange={() => setIsBedpres((prev) => !prev)} />
      <Label>Bedpres</Label>
      <Checkbox checked={isPast} onCheckedChange={() => setIsPast((prev) => !prev)} />
      <Label>Vis tidligere</Label>
      <div>
        {thisWeek.length > 0 && (
          <div>
            <h3>Denne uken</h3>
            {thisWeek.map((event) => (
              <div key={event._id}>
                <div>
                  {event.title} {event.date ? new Date(event.date).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
        {nextWeek.length > 0 && (
          <div>
            <h3>Neste uke</h3>
            {nextWeek.map((event) => (
              <div key={event._id}>
                <div>
                  {event.title} {event.date ? new Date(event.date).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
        {later.length > 0 && (
          <div>
            {(thisWeek.length > 0 || nextWeek.length > 0) && <h3>Senere</h3>}
            {later.map((event) => (
              <div key={event._id}>
                <div>
                  {event.title} {event.date ? new Date(event.date).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
        {earlier.length > 0 && isPast && (
          <div>
            <h3>Tidligere arrangementer</h3>
            {earlier.map((event) => (
              <div key={event._id}>
                <div>
                  {event.title} {event.date ? new Date(event.date).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
