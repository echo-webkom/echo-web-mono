import { type FullHappening } from "@/api/uno/client";

export const createBackLink = (happening: FullHappening) => {
  const happeningType = happening.type === "event" ? "arrangement" : "bedpres";
  return `/${happeningType}/${happening.slug}`;
};
