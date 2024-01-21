import { Registration, RegistrationInsert } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db";
import { revalidateRegistrations } from "./revalidate";

export async function createRegistration(registrations: Omit<RegistrationInsert, "createdAt">) {
  const [insertedRegistration] = await db
    .insert(Registration)
    .values({
      ...registrations,
      createdAt: new Date(),
    })
    .returning({ id: Registration });

  if (!insertedRegistration) {
    throw new Error("Registration failed");
  }

  revalidateRegistrations(registrations.happeningId);

  return insertedRegistration;
}
