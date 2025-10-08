import { eq } from "drizzle-orm";

import {
  officeBookings,
  type OfficeBooking,
  type OfficeBookingInsert,
} from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const createBooking = async (newBooking: OfficeBookingInsert): Promise<OfficeBooking> => {
  const [insertedBooking] = await db.insert(officeBookings).values(newBooking).returning();
  return insertedBooking;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await db.delete(officeBookings).where(eq(officeBookings.id, id));
};
