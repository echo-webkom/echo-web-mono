import RemoveMarkdown from "remove-markdown";

import { type HappeningType } from "@echo-webkom/lib";

import { type fetchAllHappenings } from "@/sanity/happening";
import { type fetchMovies } from "@/sanity/movies";
import { createHappeningLink } from "./create-link";

type CalendarEventType = "event" | "bedpres" | "movie" | "boardgame" | "other";

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  body: string;
  link: string;
  type: CalendarEventType;
};

const mapHappeningToType = (happeningType: HappeningType): CalendarEventType => {
  switch (happeningType) {
    case "bedpres":
    case "event":
      return happeningType;
    case "external":
      return "other";
  }
};

export const happeningsToCalendarEvent = (
  happenings: Awaited<ReturnType<typeof fetchAllHappenings>>,
): Array<CalendarEvent> => {
  return happenings
    .filter((happening) => Boolean(happening.date))
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date),
      endDate: happening.endDate ? new Date(happening.endDate) : undefined,
      body: RemoveMarkdown(happening.body ?? ""),
      link: createHappeningLink(happening),
      type: mapHappeningToType(happening.happeningType),
    }));
};

export const moviesToCalendarEvent = (
  movies: Awaited<ReturnType<typeof fetchMovies>>,
): Array<CalendarEvent> => {
  return movies.map((movie) => ({
    id: movie._id,
    title: `Film: ${movie.title}`,
    date: new Date(movie.date),
    body: `Se ${movie.title} med filmklubben!`,
    link: movie.link ?? "#",
    type: "movie",
  }));
};

/**
 * Static method to generate a list of calendar events for boardgame nights.
 * The events are generated for the next 25 weeks.
 * @returns {Array<CalendarEvent>} List of calendar events for boardgame nights.
 */
export const boardgamesToCalendarEvent = (): Array<CalendarEvent> => {
  const events: Array<CalendarEvent> = [];
  const today = new Date();
  const boardgameDay = 2; // Tuesday

  for (let i = 0; i < 25; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + ((boardgameDay - today.getDay() + 7) % 7) + 7 * i);
    eventDate.setHours(18, 0, 0, 0);

    events.push({
      id: `boardgame-${i}`,
      title: "Brettspillkveld 🎲",
      date: eventDate,
      body: "Bli med på brettspillkveld!",
      link: "https://echo.uib.no/for-studenter/gruppe/echo-brettspill",
      type: "boardgame",
    });
  }

  return events;
};
