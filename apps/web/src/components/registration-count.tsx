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
    <>
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {registeredCount} / {maxCapacity || <span className="italic">Uendelig</span>}
    </>
  );
}
