"use server";

import { z } from "zod";

import { NotificationInsert, notifications, usersToNotifications } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { getUser } from "@/lib/get-user";

const notificationSchema = z.object({
  name: z.string().min(1, "Navn på notifikasjon er obligatorisk"),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date(),
});

export const createNotification = async (payload: z.infer<typeof notificationSchema>) => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "Du må være logget inn for å opprette en notifikasjon.",
      };
    }

    const data = await notificationSchema.parseAsync(payload);

    if (data.dateFrom >= data.dateTo) {
      return {
        success: false,
        message: "Startdatoen må være før sluttdatoen.",
      };
    }

    const newNotification: NotificationInsert = {
      name: data.name,
      dateFrom: data.dateFrom.toISOString(),
      dateTo: data.dateTo.toISOString(),
      createdBy: user.id,
    };

    const [insertedNotification] = await db
      .insert(notifications)
      .values(newNotification)
      .returning({ id: notifications.id });

    if (!insertedNotification) {
      return {
        success: false,
        message: "Kunne ikke opprette notifikasjonen.",
      };
    }

    await db.insert(usersToNotifications).values({
      notificationId: insertedNotification.id,
      userId: user.id,
      isRead: false,
    });

    return {
      success: true,
      message: "Notifikasjonen ble opprettet.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      message: "Det oppsto en feil under opprettelsen av notifikasjonen.",
    };
  }
};
