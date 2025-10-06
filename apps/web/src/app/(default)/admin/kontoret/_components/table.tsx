import { useEffect, useRef } from "react";

import type { Booking } from "../page";
import { BookingItem } from "./bookingItem";
import { CalendarTableSidebar } from "./tableSidebar";

export const CalendarTable = ({
  weekDays,
  bookings,
  date,
  addBooking,
}: {
  weekDays: Array<Date>;
  bookings: Array<Booking>;
  date: Date;
  addBooking: (day: Date) => void;
}) => {
  const startHour = 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * 64;
    }
  }, [date]);

  return (
    <div ref={scrollRef} className="relative flex overflow-y-auto" style={{ height: "500px" }}>
      <CalendarTableSidebar startHour={startHour} />
      <div className="relative grid h-full flex-1 grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="relative border-l"
            style={{ minHeight: `${64 * 24}px` }}
            onDoubleClick={() => addBooking(day)}
            onDragOver={(e) => e.preventDefault()} // Allow drop
            onDrop={(e) => {
              const bookingId = e.dataTransfer.getData("bookingId");
              // Optionally, calculate drop position (e.nativeEvent.offsetY)
              // Call a function to update the booking's time
              handleDrop(bookingId, day, e.nativeEvent.offsetY);
            }}
          >
            {bookings
              .filter((b) => new Date(b.startTime).toDateString() === day.toDateString())
              .map((b) => (
                <BookingItem key={b.id} booking={b} startHour={startHour} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function handleDrop(bookingId: string, day: Date, offsetY: number) {
  // Calculate new hour from offsetY (assuming 64px per hour)
  const hour = Math.floor(offsetY / 64);
  const newStartTime = new Date(day);
  newStartTime.setHours(hour, 0, 0, 0);

  // Update booking in your state/backend here
  // Example: updateBookingTime(bookingId, newStartTime);
}
