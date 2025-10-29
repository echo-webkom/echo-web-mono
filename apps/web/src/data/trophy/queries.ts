import { getRegistrationsByUserId } from "../registrations/queries";

export type RegistrationForTrophy = {
  userId: string;
  status: "registered" | "unregistered" | "removed" | "waiting" | "pending";
  happening: {
    slug: string;
    title: string;
  };
};

export async function getRegistrationsForTrophy(
  userId: string,
): Promise<Array<RegistrationForTrophy>> {
  const rows = await getRegistrationsByUserId(userId);
  return rows.map((r) => ({
    userId: r.userId,
    status: r.status,
    happening: {
      slug: r.happening.slug,
      title: r.happening.title,
    },
  }));
}
