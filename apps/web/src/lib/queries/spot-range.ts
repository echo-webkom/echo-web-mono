import { prisma, type SpotRange } from "@echo-webkom/db";

import { type Result } from "./utils";

export async function getSpotRangeBySlug(
  slug: SpotRange["happeningSlug"],
): Promise<Result<Array<SpotRange>>> {
  try {
    const data = await prisma.spotRange.findMany({
      where: {
        happeningSlug: slug,
      },
    });

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get spot range",
    };
  }
}
