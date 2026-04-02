import { eachDayOfInterval } from "date-fns";
import removeMd from "remove-markdown";

import { type CMSHappening, type CMSMovie, type CMSRepeatingHappening } from "@/api/uno/client";
import { getDate } from "@/utils/date";
import { createHappeningLink } from "./create-link";

type CalendarEventType = "event" | "bedpres" | "movie" | "boardgame" | "other";

type Happening = CMSHappening | CMSRepeatingHappening;

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
  happenings: Array<CMSHappening>,
): Array<CalendarEvent> => {
  return happenings
    .filter((happening) => happening.date !== null)
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date!),
      endDate: happening.endDate ? new Date(happening.endDate) : undefined,
      body: removeMd(happening.body ?? ""),
      link: createHappeningLink(happening),
      type: getCalendarEventType(happening),
    }));
};

export const moviesToCalendarEvent = (movies: Array<CMSMovie>): Array<CalendarEvent> => {
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
  repeatingHappenings: Array<CMSRepeatingHappening>,
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

        // TODO: Use the current time zone instead of hardcoding +01:00
        // FIX timezone
        const offset = "01:00";
        const startDate = `${year}-${month}-${day}T${startHour}:${startMinute}:00+${offset}`;
        const endDate = `${year}-${month}-${day}T${endHour}:${endMinute}:00+${offset}`;

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
