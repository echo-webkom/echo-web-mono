/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { BiInfinite } from "react-icons/bi";

import { useRegistrations } from "@/hooks/use-registrations";
import { cn } from "@/utils/cn";

type RegistrationCountProps = {
  happeningId: string;
  maxCapacity: number | null;
  initialRegistaredCount: number;
  initialWaitlistCount: number;
};

export const RegistrationCount = ({
  happeningId,
  maxCapacity,
  initialRegistaredCount,
  initialWaitlistCount,
}: RegistrationCountProps) => {
  const { registeredCount } = useRegistrations(
    happeningId,
    initialRegistaredCount,
    initialWaitlistCount,
  );

  const precent = Math.round((registeredCount / (maxCapacity || 1)) * 100);
  const hasProgressBar = Boolean(maxCapacity && precent > 0);

  return (
    <div className="flex items-center gap-1">
      {Math.min(registeredCount, maxCapacity || Number.POSITIVE_INFINITY)} /{" "}
      {maxCapacity || <BiInfinite className="h-5 w-5" />}
      {hasProgressBar && (
        <div className="h-4 w-full overflow-hidden rounded-md border">
          <div
            style={{
              width: `${precent}%`,
              transition: "width 0.5s",
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
};
