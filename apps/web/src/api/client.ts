import { UnoClient } from "./uno/client";

export const uno = new UnoClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

/**
 * Creates a profile picture URL for a user.
 *
 * @param userId The user's ID.
 * @param size Uno supports 1 and 2 as size parameters, where 1 is the default (small) and 2 is the larger version of the image. Defaults to 1.
 * @returns The profile picture URL, or undefined if the user has no ID.
 */
export const createProfilePictureUrl = (userId: string | null | undefined, size = 1) => {
  if (!userId) return undefined;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://uno.echo-webkom.no";
  return `${baseUrl}/users/${userId}/image?size=${size}`;
};
