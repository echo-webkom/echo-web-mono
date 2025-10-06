"use client";

import { useEffect, useState } from "react";

import { CalendarControls } from "./_components/controls";
import { CalendarTable } from "./_components/table";
import { TableHeader } from "./_components/tableHeader";

function getWeekDays(baseDate: Date) {
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

export type Booking = {
  id: number;
  user?: { name: string };
  startTime: string;
  endTime: string;
};

export default function BookingWeek() {
  // await ensureWebkomOrHovedstyret(); -> on server component not client

  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const weekDays = getWeekDays(date);

  useEffect(() => {
    // fetch(`/api/bookings?weekOf=${date.toISOString().split("T")[0]}`)
    //   .then((res) => res.json())
    //   .then(setBookings);
    setBookings([
      {
        id: 1,
        user: { name: "Ola Nordmann" },
        startTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          9,
          0,
        ).toISOString(),
        endTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          10,
          30,
        ).toISOString(),
      },
      {
        id: 2,
        user: { name: "Kari Nordmann" },
        startTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          13,
          0,
        ).toISOString(),
        endTime: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          14,
          0,
        ).toISOString(),
      },
    ]);
  }, [date]);

  const addBooking = async (day: Date) => {
    const startTime = prompt("Starttid (HH:MM):");
    const endTime = prompt("Sluttid (HH:MM):");
    if (!startTime || !endTime) return;

    const start = new Date(`${day.toISOString().split("T")[0]}T${startTime}`);
    const end = new Date(`${day.toISOString().split("T")[0]}T${endTime}`);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime: start, endTime: end }),
    });

    if (res.ok) {
      // const booking = await res.json();
      // setBookings((prev) => [...prev, booking]);
    }
  };

  return (
    <div className="m-4">
      <CalendarControls date={date} weekDays={weekDays} setDate={setDate} />
      <TableHeader weekDays={weekDays} />
      <CalendarTable weekDays={weekDays} bookings={bookings} date={date} addBooking={addBooking} />
    </div>
  );
}
