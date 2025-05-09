import { type HappeningType } from "@echo-webkom/lib";

type Linkable = {
  slug: string;
  happeningType: HappeningType;
};

export const createHappeningLink = <T extends Linkable>({ slug, happeningType }: T) => {
  if (happeningType === "bedpres") return `/bedpres/${slug}`;
  if (happeningType === "event") return `/arrangement/${slug}`;
  if (happeningType === "external") return `/arrangement/${slug}`;

  // TODO: External events should have an external link attached to it.
  return "";
};
