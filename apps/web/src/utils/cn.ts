import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names together.
 *
 * @example
 * ```ts
 * cn("text-red-500", "bg-blue-500"); // "text-red-500 bg-blue-500"
 *
 * cn("text-red-500", { "bg-blue-500": true }); // "text-red-500 bg-blue-500"
 *
 * cn("text-red-500", { "bg-blue-500": false }); // "text-red-500"
 * ```
 *
 *
 * @param inputs the class names to merge
 * @returns the merged class names
 */
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}
