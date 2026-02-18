import { Children } from "react";

/**
 * Generates an ID based on the string children of a React Component.
 * This is useful for generating IDs for headings, which can then be used for anchor links.
 *
 * @param children React components to generate an ID from. Only string children will be used.
 * @returns A string ID generated from the string.
 */
export const generateId = (children: React.ReactNode) => {
  return Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join("")
    .replace(/\s+/g, "-")
    .toLowerCase();
};
