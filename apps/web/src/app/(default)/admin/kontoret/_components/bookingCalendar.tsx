"use client";

import { useEffect, useState } from "react";

import { addBooking } from "@/actions/bookings"; // 👈 now imports the server action
import { toast } from "@/hooks/use-toast";
import BookingModal from "./bookingModal";
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
  id?: number;
  title: string;
  startTime: Date;
  endTime: Date;
  user: {
    id: string;
    name: string;
  };
};

export default function BookingCalendar({
  user,
  allBookings,
}: {
  user: { id: string; name: string };
  allBookings?: Array<Booking>;
}) {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<Date | null>(null);

  const weekDays = getWeekDays(date);

  // initialize bookings
  useEffect(() => {
    if (allBookings) setBookings(allBookings);
  }, [allBookings]);

  // filter out old bookings when switching week
  useEffect(() => {
    setBookings((prev) => prev.filter((b) => b.startTime >= date));
  }, [date]);

  const openAddModal = (day: Date) => {
    setModalDay(day);
    setModalOpen(true);
  };

  const handleSubmitFromModal = async (values: { title: string; start: string; end: string }) => {
    if (!modalDay) return;

    const datePrefix = modalDay.toISOString().split("T")[0];
    const startISO = `${datePrefix}T${values.start}`;
    const endISO = `${datePrefix}T${values.end}`;

    try {
      const result = await addBooking({
        title: values.title || "Kontorplass",
        startTime: startISO,
        endTime: endISO,
        userId: user.id,
      });

      if (!result?.success) {
        toast({
          title: result?.message ?? "Kunne ikke lagre bookingen.",
          variant: "destructive",
        });
        return;
      }

      // Construct new booking with local user object
      const newBooking: Booking = {
        id: result.booking.id,
        title: result.booking.title ?? values.title ?? "Kontorplass",
        startTime: new Date(result.booking.startTime),
        endTime: new Date(result.booking.endTime),
        user, // attach logged-in user
      };

      setBookings((prev) => [...prev, newBooking]);
      setModalOpen(false);
      setModalDay(null);

      toast({
        title: "Bookingen ble lagret!",
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Serverfeil — prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="m-4">
      <CalendarControls date={date} weekDays={weekDays} setDate={setDate} />
      <TableHeader weekDays={weekDays} />
      <CalendarTable
        weekDays={weekDays}
        bookings={bookings}
        date={date}
        addBooking={openAddModal}
        user={user}
      />
      <BookingModal
        open={modalOpen}
        day={modalDay}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitFromModal}
      />
    </div>
  );
}
