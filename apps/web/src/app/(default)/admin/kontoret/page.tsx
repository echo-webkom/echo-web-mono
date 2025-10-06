import { auth } from "@/auth/session";
import { getAllBookings } from "@/data/office-booking/queries";
import { ensureWebkomOrHovedstyret } from "@/lib/ensure";
import BookingCalendar from "./_components/bookingCalendar";

export default async function Page() {
  await ensureWebkomOrHovedstyret();

  const [user, allBookings] = await Promise.all([auth(), getAllBookings()]);

  return <BookingCalendar allBookings={allBookings} />;
}
