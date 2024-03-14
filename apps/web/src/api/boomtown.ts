import "server-only";

export const BOOMTOWN_HOSTNAME = process.env.NEXT_PUBLIC_BOOMTOWN_HOSTNAME;

export async function pingBoomtown(happeningId: string) {
  return await fetch(
    `${process.env.NODE_ENV === "production" ? "https" : "http"}://${BOOMTOWN_HOSTNAME}/${happeningId}`,
    {
      method: "POST",
    },
  ).then((response) => response.status === 200);
}
