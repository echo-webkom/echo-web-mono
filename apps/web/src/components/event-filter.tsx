"use client";

import {useState} from "react";
import {isAfter, isBefore} from "date-fns";

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

  const currentDate = new Date();

  const filteredEvents = events.filter((event) => {
    if (event.type === "EVENT" && isEvent) {
      return event.title.toLowerCase().includes(searchTitle.toLowerCase());
    }
    if (event.type === "BEDPRES" && isBedpres) {
      return event.title.toLowerCase().includes(searchTitle.toLowerCase());
    }
    return false;
  });

  const filteredDate = filteredEvents.filter((event) => {
    if (!isPast && event.date) {
      if (isBefore(new Date(event.date), currentDate)) {
        return false;
      }
    }
    return true;
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
        {filteredDate.map((event) => (
          <div key={event._id}>
            <div>
              {event.title} {event.date ? new Date(event.date).toLocaleDateString() : "Ingen dato"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
