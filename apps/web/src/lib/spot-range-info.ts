import { isFuture } from "date-fns";

const INFINITY = "∞";

export const getSpotRangeInfo = ({
  registrationStart,
  waiting,
  registered,
  max,
}: {
  registrationStart: string | null;
  waiting: number;
  registered: number;
  max: number | null;
}) => {
  const actualCapacity = max === 0 ? INFINITY : max;

  if (!registrationStart || max === null) {
    return null;
  }

  if (isFuture(new Date(registrationStart))) {
    return `${actualCapacity} plasser`;
  }

  if (actualCapacity !== INFINITY && registered + waiting >= max) {
    return "Fullt";
  }

  return `${registered}/${actualCapacity}`;
};
