import type { OfficeBooking } from "node_modules/@echo-webkom/db/src/schemas/office-booking";

import { auth } from "@/auth/session";
import { getAllBookings } from "@/data/office-booking/queries";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import BookingCalendar from "./_components/bookingCalendar";

export default async function Page() {
  await ensureWebkomOrHovedstyret();

  const [user, allBookingsRaw] = await Promise.all([auth(), getAllBookings()]);

  const allBookings = allBookingsRaw.map((b: OfficeBooking) => ({
    ...b,
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
  }));

  const userName = user?.name ?? null;

  return (
    <>
      <BookingCalendar user={userName} allBookings={allBookings} />
    </>
  );
}
