import { type HappeningType } from "@echo-webkom/lib";

export const createHappeningLink = (slug: string, type: HappeningType) => {
  if (type === "bedpres") return `/bedpres/${slug}`;
  if (type === "event") return `/arrangementer/${slug}`;

  return null;
};
