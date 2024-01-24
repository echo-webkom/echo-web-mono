import { db } from "@echo-webkom/db";
import { registrations, type RegistrationInsert } from "@echo-webkom/db/schemas";

import { revalidateRegistrations } from "./revalidate";

export async function createRegistration(newRegistrations: Omit<RegistrationInsert, "createdAt">) {
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
}
