"use client";

import {useState} from "react";

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

  const filteredEvents = events.filter((event) => {
    if (event.type === "EVENT" && isEvent) {
      return event.title.toLowerCase().includes(searchTitle.toLowerCase());
    }
    if (event.type === "BEDPRES" && isBedpres) {
      return event.title.toLowerCase().includes(searchTitle.toLowerCase());
    }
    return false;
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
      <div>
        {filteredEvents.map((event) => (
          <div key={event._id}>
            <div>{event.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
