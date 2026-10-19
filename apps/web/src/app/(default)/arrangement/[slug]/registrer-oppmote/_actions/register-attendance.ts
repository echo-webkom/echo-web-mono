"use server";

import { registrations } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { and, eq, isNull, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth/session";

export type AttendanceResult = {
  status:
    | "attended"
    | "already-attended"
    | "unauthenticated"
    | "not-registered"
    | "not-found"
    | "error";
};

export async function registerOwnAttendance(slug: string): Promise<AttendanceResult> {
  try {
    const user = await auth();
    if (!user) {
      return { status: "unauthenticated" };
    }

    const happening = await db.query.happenings.findFirst({
      columns: { id: true },
      where: (happening, { eq }) => eq(happening.slug, slug),
    });
    if (!happening) {
      return { status: "not-found" };
    }

    const registrationFilter = and(
      eq(registrations.happeningId, happening.id),
      eq(registrations.userId, user.id),
    );
    const [updated] = await db
      .update(registrations)
      // Preserve the registration's status-change history when checking in.
      .set({ attended: true, changedAt: registrations.changedAt })
      .where(
        and(
          registrationFilter,
          eq(registrations.status, "registered"),
          or(eq(registrations.attended, false), isNull(registrations.attended)),
        ),
      )
      .returning({ userId: registrations.userId });

    if (updated) {
      revalidatePath(`/dashbord/${slug}`);
      return { status: "attended" };
    }

    const registration = await db.query.registrations.findFirst({
      columns: { status: true, attended: true },
      where: registrationFilter,
    });

    if (registration?.status === "registered" && registration.attended) {
      return { status: "already-attended" };
    }

    return { status: "not-registered" };
  } catch (error) {
    console.error("Failed to register own attendance:", error);
    return { status: "error" };
  }
}
