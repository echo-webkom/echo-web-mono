"use client";

import { useEffect, useState } from "react";

import { CalendarControls } from "./controls";
import { CalendarTable } from "./table";
import { TableHeader } from "./tableHeader";

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

export default function BookingCalendar({
  user,
  allBookings,
}: {
  user?: { name: string };
  allBookings?: Array<Booking>;
}) {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const weekDays = getWeekDays(date);

  useEffect(() => {
    if (allBookings) setBookings(allBookings);
  }, [allBookings]);

  useEffect(() => {
    setBookings((prev) => [...prev.filter((b) => b.startTime >= date.toISOString())]);
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
