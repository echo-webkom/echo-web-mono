import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

// TODO: Move to a separate package
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
