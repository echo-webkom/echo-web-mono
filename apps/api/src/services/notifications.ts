import { Hono } from "hono";

import { db } from "@/lib/db";
import { admin } from "../middleware/admin";

const app = new Hono();

app.get("/notifications", admin(), async (c) => {
<<<<<<< HEAD
=======

>>>>>>> 2b2bdb9dc36b8618834dea36bff783b7ea4b6e9a
  try {
    const allNotifications = await db.query.notifications.findMany({
      with: { recipients: true },
      orderBy: (row, { desc }) => [desc(row.dateFrom)],
    });

<<<<<<< HEAD
    return c.json(allNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ error: "Internal Server Error", er: error }, 500);
  }
});

export default app;
=======
    console.log("Fetched notifications:", allNotifications);

    return c.json(allNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error); 
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
>>>>>>> 2b2bdb9dc36b8618834dea36bff783b7ea4b6e9a
