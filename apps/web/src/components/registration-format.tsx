"use server";

import { registrationStatusToString } from "@echo-webkom/lib";

import { getHappeningById } from "@/data/happenings/queries";
import { cn } from "@/utils/cn";
import { hoursBetween } from "@/utils/date";
import { type RegistrationWithUser } from "./registration-table";

export default async function getRegistrationStatus(registration: RegistrationWithUser) {
  const happening = await getHappeningById(registration.happeningId);
  if (registration.changedBy && registration.changedAt && registration.prevStatus) {
    const hours = Math.floor(hoursBetween(registration.changedAt, happening?.date ?? null));
    return cn(
      registrationStatusToString[registration.status],
      registration.prevStatus === "waiting" &&
        `fra ${registrationStatusToString[registration.prevStatus].toLowerCase()}`,
      hours < 24 && `${hours} timer før`,
    );
  }
  return registrationStatusToString[registration.status];
}
