import { eq } from "drizzle-orm";
import { type Handler } from "hono";

import { db, getSpotRangeByHappening } from "@echo-webkom/storage";

export const handleGetHappeningSpotRanges: Handler = async (c) => {
  const { slug } = c.req.param();

  if (!slug) {
    c.status(400);
    return c.text("No slug provided");
  }

  const happening = await db.query.happenings.findFirst({
    where: (h) => eq(h.slug, slug),
  });

  if (!happening) {
    c.status(404);
    return c.text("Happening not found");
  }

  const spotRanges = await getSpotRangeByHappening(slug);

  return c.json(spotRanges);
};
