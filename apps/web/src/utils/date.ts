import { capitalize } from "./string";

export function norwegianDateString(date: Date | string) {
  const d = new Date(date);

  return capitalize(
    d.toLocaleDateString("nb-NO", {
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

export function shortDate(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleTimeString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}

export function shortDateNoTime(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Oslo",
  });
}

export function time(date: Date | string) {
  const d = new Date(date);

  return d.toLocaleTimeString("nb-NO", {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Oslo",
  });
}
