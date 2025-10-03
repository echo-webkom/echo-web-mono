"use client";

import { useEffect, useRef, useState } from "react";

function getWeekDays(baseDate: Date) {
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
}

type Booking = {
  id: number;
  user?: { name: string };
  startTime: string; // ISO string
  endTime: string; // ISO string
};

export default function BookingWeek() {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const weekDays = getWeekDays(date);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Scroll to 08:00 (8 * 64px)
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * 64;
    }
  }, [date]); // scroll on week change

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

  // Add week navigation handlers
  const prevWeek = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 7);
    setDate(d);
  };

  const nextWeek = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    setDate(d);
  };

  // timeline range
  const startHour = 0;
  const endHour = 23;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <div>
      {/* Week navigation */}
      <div className="mb-4 flex items-center gap-2">
        <button onClick={prevWeek} className="rounded border px-2 py-1">
          ← Forrige uke
        </button>
        <span className="font-semibold">
          Uke {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
        </span>
        <button onClick={nextWeek} className="rounded border px-2 py-1">
          Neste uke →
        </button>
      </div>
      <div
        pref={scrollRef}
        className="relative flex overflow-y-auto border"
        style={{ height: "500px" }}
      >
        {/* Timeline */}
        <div className="h-full w-16 border-r text-xs">
          {hours.map((h) => (
            <div key={h} className="h-16 border-b">{`${h}:00`}</div>
          ))}
        </div>

        {/* Days */}
        <div ref={scrollRef} className="relative grid h-full flex-1 grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="relative border-l"
              style={{ minHeight: `${64 * 24}px` }}
              onDoubleClick={() => addBooking(day)}
            >
              {/* Bookings for this day */}
              {bookings
                .filter((b) => new Date(b.startTime).toDateString() === day.toDateString())
                .map((b) => {
                  const start = new Date(b.startTime);
                  const end = new Date(b.endTime);
                  const durationHours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
                  const top = (start.getHours() + start.getMinutes() / 60 - startHour) * 64;
                  const height = durationHours * 64;
                  return (
                    <div
                      key={b.id}
                      className="absolute left-1 right-1 rounded bg-blue-500 p-1 text-xs text-white"
                      style={{ top, height }}
                    >
                      {b.user?.name ?? "Ukjent"}
                      <br />
                      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                      {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
