import { registrationStatusToString } from "@echo-webkom/lib";

import { type RegistrationWithUser } from "@/components/registration-table";
import { cn } from "@/utils/cn";
import { _differenceInHours } from "@/utils/date";

export function getRegistrationStatus(
  registration: Omit<
    RegistrationWithUser,
    "userId" | "happeningId" | "unregisterReason" | "answers" | "user" | "changedBy"
  > & {
    status: "registered" | "unregistered" | "removed" | "waiting" | "pending";
    prevStatus: "registered" | "unregistered" | "removed" | "waiting" | "pending" | null;
    changedAt: Date | null;
    createdAt: Date;
  },
  happeningDate: Date | null,
) {
  if (registration.changedAt && registration.prevStatus) {
    const hours = Math.floor(_differenceInHours(happeningDate, registration.changedAt));
    return cn(
      registrationStatusToString[registration.status],
      (registration.prevStatus === "waiting" || registration.prevStatus === "unregistered") &&
        `fra ${registrationStatusToString[registration.prevStatus].toLowerCase()}`,
      hours < 24 && `${hours} t før`,
    );
  }
  const hours = Math.floor(_differenceInHours(happeningDate, registration.createdAt));
  return cn(registrationStatusToString[registration.status], hours < 24 && `${hours} t før`);
}
