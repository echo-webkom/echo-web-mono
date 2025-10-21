import { isPast } from "date-fns";

export const isExpired = isPast;
export const createKey = (...keys: Array<string>): string => keys.join(":");
