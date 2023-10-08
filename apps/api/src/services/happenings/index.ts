import { Hono } from "hono";

import { getHappenings } from "@echo-webkom/storage";

const happeningsService = new Hono();

happeningsService.get("/happenings", async (c) => {
  const { limit, offset, type } = c.req.query();

  const happenings = await getHappenings({
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    type: type === "bedpres" ? "bedpres" : type === "event" ? "event" : undefined,
  });

  return c.json(happenings);
});

export default happeningsService;
