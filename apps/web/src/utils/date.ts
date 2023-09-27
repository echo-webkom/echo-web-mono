import { capitalize } from "./string";

export function norwegianDateString(date: Date) {
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
}

export function shortDate(date: Date) {
  return date.toLocaleTimeString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}
