import { type getRegistrations } from "./get-registrations";

export type RegistrationWithUser = Awaited<ReturnType<typeof getRegistrations>>[0];

export type DashboardGroup = {
  id: string;
  name: string;
};
