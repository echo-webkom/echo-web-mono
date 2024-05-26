import { isFuture } from "date-fns";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

const INFINITY = "∞";

export function getSpotRangeInfo<
  H extends { registrationStart: string | null },
  S extends { spots: number },
  R extends { status: RegistrationStatus },
>(happening: H, spotRanges: Array<S>, registrations: Array<R>) {
  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  const waitingListCount = registrations.filter(
    (registration) => registration.status === "waiting",
  ).length;

  const actualCapacity = maxCapacity === 0 ? INFINITY : maxCapacity;

  if (!happening.registrationStart || spotRanges.length === 0) {
    return null;
  }

  if (isFuture(new Date(happening.registrationStart))) {
    return `${actualCapacity} plasser`;
  }

  if (actualCapacity !== INFINITY && registeredCount + waitingListCount >= maxCapacity) {
    return "Fullt";
  }

  return `${registeredCount}/${actualCapacity}`;
}
