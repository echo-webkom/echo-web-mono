import "server-only";
import { unoWithAdmin } from "@/api/server";
import { type FullRegistrationRow, type RegistrationStatus } from "@/api/uno/client";

const sortRegistrations = (registrations: Array<FullRegistrationRow>) => {
  registrations.sort((a, b) => {
    const statusOrder: Record<RegistrationStatus, number> = {
      registered: 0,
      waiting: 1,
      unregistered: 2,
      removed: 3,
      pending: 4,
    };
    if (a.status === b.status) {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }

    return statusOrder[a.status] - statusOrder[b.status];
  });

  return registrations;
};

const toDashboardRegistrations = (registrations: Array<FullRegistrationRow>) => {
  return registrations.map((registration) => ({
    ...registration,
    user: {
      ...registration.user,
      memberships: registration.user.groups.map((group) => ({
        group: {
          id: group.id,
          name: group.name,
        },
      })),
      degreeId: registration.user.degree?.id ?? null,
      alternativeEmail: registration.user.alternativeEmail,
    },
  }));
};

export const getRegistrations = async (happeningId: string) => {
  const registrations = await unoWithAdmin.happenings.registrationsFull(happeningId);
  return toDashboardRegistrations(sortRegistrations(registrations));
};
