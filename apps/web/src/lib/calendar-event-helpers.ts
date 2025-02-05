import { eachDayOfInterval } from "date-fns";
import removeMd from "remove-markdown";

import { type fetchAllHappenings } from "@/sanity/happening";
import { type fetchMovies } from "@/sanity/movies";
import { type fetchAllRepeatingHappenings } from "@/sanity/repeating-happening";
import { getDate } from "@/utils/date";
import { createHappeningLink } from "./create-link";

type CalendarEventType = "event" | "bedpres" | "movie" | "boardgame" | "other";

type FetchAllRepeatingHappeningsResult = Awaited<ReturnType<typeof fetchAllRepeatingHappenings>>;
type FetchAllHappeningsResult = Awaited<ReturnType<typeof fetchAllHappenings>>;
type FetchMoviesResult = Awaited<ReturnType<typeof fetchMovies>>;

type Happening = FetchAllHappeningsResult[number] | FetchAllRepeatingHappeningsResult[number];

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  body: string;
  link: string;
  type: CalendarEventType;
};

const getCalendarEventType = (happening: Happening): CalendarEventType => {
  const isBoardgameGroup = happening.organizers?.some(
    (organizer) => organizer.slug === "echo-brettspill",
  );

  if (isBoardgameGroup) {
    return "boardgame";
  }

  switch (happening.happeningType) {
    case "bedpres":
    case "event":
      return happening.happeningType;
    case "external":
      return "other";
  }
};

export const happeningsToCalendarEvent = (
  happenings: FetchAllHappeningsResult,
): Array<CalendarEvent> => {
  return happenings
    .filter((happening) => Boolean(happening.date))
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date),
      endDate: happening.endDate ? new Date(happening.endDate) : undefined,
      body: removeMd(happening.body ?? ""),
      link: createHappeningLink(happening),
      type: getCalendarEventType(happening),
    }));
};

export const moviesToCalendarEvent = (movies: FetchMoviesResult): Array<CalendarEvent> => {
  return movies.map((movie) => ({
    id: movie._id,
    title: `Film: ${movie.title}`,
    date: new Date(movie.date),
    body: `Se ${movie.title} med filmklubben!`,
    link: movie.link ?? "#",
    type: "movie",
  }));
};

export const repeatingEventsToCalendarEvent = (
  repeatingHappenings: FetchAllRepeatingHappeningsResult,
): Array<CalendarEvent> => {
  return repeatingHappenings.flatMap((happening) => {
    return eachDayOfInterval({
      start: new Date(happening.startDate),
      end: new Date(happening.endDate),
    })
      .filter((date) => !happening.ignoredDates?.map(getDate).includes(getDate(date)))
      .filter((date) => date.getDay() === happening.dayOfWeek)
      .filter((_, i) => {
        switch (happening.interval) {
          case "weekly":
            return true;
          case "bi-weekly":
            return i % 2 === 0;
          case "monthly":
            return i % 4 === 0;
          default:
            return false;
        }
      })
      .map((date) => {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");

        const startHour = happening.startTime.hour.toString().padStart(2, "0");
        const startMinute = happening.startTime.minute.toString().padStart(2, "0");

        const endHour = happening.endTime.hour.toString().padStart(2, "0");
        const endMinute = happening.endTime.minute.toString().padStart(2, "0");

        const startDate = `${year}-${month}-${day}T${startHour}:${startMinute}:00+01:00`;
        const endDate = `${year}-${month}-${day}T${endHour}:${endMinute}:00+01:00`;

        return {
          id: happening._id,
          title: happening.title,
          date: new Date(startDate),
          endDate: new Date(endDate),
          body: removeMd(happening.body ?? ""),
          link: createHappeningLink(happening),
          type: getCalendarEventType(happening),
        };
      });
  });
};
