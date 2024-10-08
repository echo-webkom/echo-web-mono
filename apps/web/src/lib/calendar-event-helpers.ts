import RemoveMarkdown from "remove-markdown";

import { type HappeningType } from "@echo-webkom/lib";

import { type fetchAllHappenings } from "@/sanity/happening";
import { type fetchMovies } from "@/sanity/movies";
import { createHappeningLink } from "./create-link";

type CalendarEventType = "event" | "bedpres" | "movie" | "other";

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
