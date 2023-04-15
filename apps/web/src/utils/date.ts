import {capitalize} from "./string";

export const norwegianDateString = (date: Date) => {
  return capitalize(
    date.toLocaleDateString("nb-NO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/Oslo",
    }),
  );
};
