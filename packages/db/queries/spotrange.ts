import {type SpotRange} from "@prisma/client";

import {prisma} from "../client";

export const getSpotRangesSlug = async (slug: SpotRange["happeningSlug"]) => {
  return await prisma.spotRange.findMany({
    where: {
      happeningSlug: slug,
    },
  });
};
