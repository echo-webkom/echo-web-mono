import { Children } from "react";

export const generateId = (children: React.ReactNode) => {
  return Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join("")
    .replace(/\s+/g, "-")
    .toLowerCase();
};
