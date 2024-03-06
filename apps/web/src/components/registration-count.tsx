/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { useRegistrations } from "@/hooks/use-registrations";

type RegistrationCountProps = {
  happeningId: string;
  maxCapacity: number | null;
  initialRegistaredCount: number;
  initialWaitlistCount: number;
};

export function RegistrationCount({
  happeningId,
  maxCapacity,
  initialRegistaredCount,
  initialWaitlistCount,
}: RegistrationCountProps) {
  const { registeredCount } = useRegistrations(
    happeningId,
    initialRegistaredCount,
    initialWaitlistCount,
  );

  return (
    <div className="flex flex-col gap-1">
      {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
      <div className="h-4 w-full">
        <div
          style={{
            width: `${(registeredCount / (maxCapacity || 1)) * 100}%`,
          }}
          className="h-full bg-green-400"
        />
        <div
          style={{
            width: `${((initialWaitlistCount + registeredCount) / (maxCapacity || 1)) * 100}%`,
          }}
          className="h-full bg-red-500"
        />
      </div>
    </div>
  );
}
