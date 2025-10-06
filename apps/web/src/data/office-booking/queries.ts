import { type OfficeBooking } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";

export const getAllBookings = async (): Promise<Array<OfficeBooking>> => {
  try {
    return await apiServer.get("office-booking").json<Array<OfficeBooking>>();
  } catch (err) {
    console.error("Error fetching office bookings", err);
    return [];
  }
};
