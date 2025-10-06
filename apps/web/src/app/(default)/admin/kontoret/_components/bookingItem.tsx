import type { Booking } from "./bookingCalendar";

export const BookingItem = ({
  booking,
  startHour = 0,
  onDragStart,
}: {
  booking: Booking;
  startHour?: number;
  onDragStart?: (booking: Booking) => void;
}) => {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const durationHours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
  const top = (start.getHours() + start.getMinutes() / 60 - startHour) * 64;
  const height = durationHours * 64;

  return (
    <div
      key={booking.id}
      className="absolute left-1 right-1 rounded bg-blue-500 p-1 text-xs text-white"
      style={{ top, height }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("bookingId", booking.id.toString());
        if (onDragStart) onDragStart(booking);
      }}
    >
      {booking.user?.name ?? "Ukjent"}
      <br />
      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
      {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </div>
  );
};
