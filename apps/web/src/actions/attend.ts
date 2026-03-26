"use server";

import { and, eq } from "drizzle-orm";

import { registrations } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { auth } from "@/auth/session";

export const attend = async (happeningId: string, userId: string) => {
  const currentUser = await auth();

  if (!currentUser) {
    return { success: false, message: "Du er ikke logget inn" };
  }

  const existingRegistration = await db.query.registrations.findFirst({
    where: (registration) =>
      and(eq(registration.happeningId, happeningId), eq(registration.userId, userId)),
  });

  if (!existingRegistration) {
    return { success: false, message: "Fant ikke påmelding" };
  }

  await db
    .update(registrations)
    .set({
      prevStatus: existingRegistration.status,
      changedBy: currentUser.id,
      status: "attended",
    })
    .where(and(eq(registrations.happeningId, happeningId), eq(registrations.userId, userId)));

  return { success: true, message: "Bruker markert som møtt" };
};
