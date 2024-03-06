/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { useRegistrations } from "@/hooks/use-registrations";
import { cn } from "@/utils/cn";

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

  const precent = Math.round((registeredCount / (maxCapacity || 1)) * 100);

  return (
    <div className="flex flex-col gap-1">
      {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
      {maxCapacity && precent > 0 && (
        <div className="h-4 w-full overflow-hidden rounded-md border">
          <div
            style={{
              width: `${(registeredCount / (maxCapacity || 1)) * 100}%`,
            }}
            className={cn("h-full", {
              "bg-red-500": precent >= 100,
              "bg-green-400": precent < 100,
            })}
          />
        </div>
      )}
    </div>
  );
}
