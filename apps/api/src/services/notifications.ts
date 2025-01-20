import { Hono } from "hono";

import { db } from "@/lib/db";
import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/notifications", admin(), async (c) => {

  try {
    const allNotifications = await db.query.notifications.findMany({
      with: { recipients: true },
      orderBy: (row, { desc }) => [desc(row.dateFrom)],
    });

    console.log("Fetched notifications:", allNotifications);

    return c.json(allNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error); 
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
