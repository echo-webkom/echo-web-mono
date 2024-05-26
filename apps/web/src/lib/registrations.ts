import { type RegistrationStatus } from "@echo-webkom/db/schemas";
import { registrationStatusToString } from "@echo-webkom/lib";

import { _differenceInHours } from "@/utils/date";

export function getRegistrationStatus<
  T extends {
    status: RegistrationStatus;
    prevStatus: RegistrationStatus | null;
    changedAt: Date | null;
    createdAt: Date;
    changedBy: string | null;
  },
>(registration: T, happeningDate: Date | null) {
  const status = registrationStatusToString[registration.status];
  const deltaTime = Math.floor(
    _differenceInHours(happeningDate, registration.changedAt ?? registration.createdAt),
  );

  const isEdited = registration.changedBy !== null;
  const isToLate = deltaTime < 24 && deltaTime > 0;

  const prevStatusText = registration.prevStatus
    ? registrationStatusToString[registration.prevStatus].toLowerCase()
    : "";

  const additionalInfo =
    registration.prevStatus === "waiting" || registration.prevStatus === "registered"
      ? ` fra ${prevStatusText}`
      : "";

  const lateInfo = isToLate ? ` ${deltaTime} t før` : "";

  const editInfo = isEdited ? `, av ${registration.changedBy}` : "";

  return `${status}${additionalInfo}${lateInfo}${editInfo}`.trim();
}
