import { type Handler } from "hono";

import { getHappening, getHappenings } from "@echo-webkom/storage";

export const handleGetHappenings: Handler = async (c) => {
  const { limit, offset, type } = c.req.query();

  const happenings = await getHappenings({
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    type: type === "bedpres" ? "bedpres" : type === "event" ? "event" : undefined,
  });

  return c.json(happenings);
};

export const handleGetHappening: Handler = async (c) => {
  const { slug } = c.req.param();

  if (!slug) {
    c.status(400);
    return c.text("No slug provided");
  }

  const happening = await getHappening(slug);

  if (!happening) {
    c.status(404);
    return c.text("Happening not found");
  }

  return c.json(happening);
};
