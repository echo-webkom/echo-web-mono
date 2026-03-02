import { UnoClient } from "./uno/client";

export const uno = new UnoClient({
  baseUrl: process.env.NEXT_PUBLIC_UNO_URL,
});

/**
 * Creates a profile picture URL with the specified size parameter.
 * This will retrieve the optimized version of the profile picture from Uno, if available.
 *
 * @param url The original profile picture URL, which may be null or undefined.
 * @param size Uno supports 1 and 2 as size parameters, where 1 is the default (small) and 2 is the larger version of the image. Defaults to 1.
 * @returns The modified profile picture URL with the size parameter, or undefined if the input URL is null or undefined.
 */
export const createProfilePictureUrl = (url: string | null | undefined, size = 1) => {
  if (!url) return undefined;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}size=${size}`;
};
