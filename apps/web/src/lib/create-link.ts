import { type HappeningType } from "@echo-webkom/lib";

interface Linkable {
  slug: string;
  happeningType: HappeningType;
}

export const createHappeningLink = <T extends Linkable>({ slug, happeningType }: T) => {
  if (happeningType === "bedpres") return `/bedpres/${slug}`;
  if (happeningType === "event") return `/arrangement/${slug}`;

  // TODO: External events should have an external link attached to it.
  return "";
};
