import { type RegistrationStatus } from "@echo-webkom/db/schemas";

export const statusColor = {
  registered: "text-green-600",
  waiting: "text-yellow-600",
  unregistered: "text-red-600",
  removed: "text-red-600",
  pending: "text-blue-600",
} satisfies Record<RegistrationStatus, string>;
