import "server-only";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const getRegistrations = async (happeningId: string) => {
  const registrations = await db.query.registrations.findMany({
    where: (registration, { eq }) => eq(registration.happeningId, happeningId),
    with: {
      changedByUser: true,
      user: {
        with: {
          memberships: {
            with: {
              group: true,
            },
          },
        },
      },
    },
  });

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
