"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";

export function Toolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const date = searchParams.get("date")
    ? new Date(`${searchParams.get("date")}T00:00:00`)
    : new Date();

  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const searchParams = new URLSearchParams();
    searchParams.set("date", format(nextDay, "yyyy-MM-dd"));

    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handlePreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);

    const searchParams = new URLSearchParams();
    searchParams.set("date", format(previousDay, "yyyy-MM-dd"));

    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="flex justify-between rounded-lg border p-4">
      <button onClick={handlePreviousDay}>Forrige dag</button>

      <p className="text-center">{format(date, "yyyy-MM-dd")}</p>

      <button onClick={handleNextDay}>Neste dag</button>
    </div>
  );
}
