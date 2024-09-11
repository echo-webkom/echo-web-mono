import { registrations, type RegistrationInsert } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { revalidateRegistrations } from "./revalidate";

export const createRegistration = async (
  newRegistrations: Omit<RegistrationInsert, "createdAt">,
) => {
  const [insertedRegistration] = await db
    .insert(registrations)
    .values({
      ...newRegistrations,
      createdAt: new Date(),
    })
    .returning({ userId: registrations.userId, happeningId: registrations.happeningId });

  if (!insertedRegistration) {
    throw new Error("Registration failed");
  }

  revalidateRegistrations(newRegistrations.happeningId, newRegistrations.userId);

  return insertedRegistration;
};
