import { type getFullHappening } from "@/data/happenings/queries";

export const createBackLink = (
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>,
) => {
  const happeningType = happening.type === "event" ? "arrangement" : "bedpres";
  return `/${happeningType}/${happening.slug}`;
};
