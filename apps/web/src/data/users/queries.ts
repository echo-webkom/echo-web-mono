import { unstable_cache as cache } from "next/cache";
import { eq } from "drizzle-orm";

import { type User } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

export const getUserById = async (id: User["id"]) => {
  return await db.query.users.findFirst({
    where: (user) => eq(user.id, id),
    with: {
      degree: true,
    },
  });
};

export const getAllUsers = async () => {
  return await cache(
    async () => {
      return await db.query.users.findMany({
        orderBy: (user, { asc }) => [asc(user.name)],
        with: {
          degree: true,
          memberships: true,
        },
      });
    },
    ["users"],
    {
      revalidate: 60,
    },
  )();
};

export const getBannedUsers = async () => {
  return await db.query.users
    .findMany({
      orderBy: (user, { asc }) => [asc(user.name)],
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        dots: {
          with: {
            strikedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
        banInfo: {
          with: {
            bannedByUser: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })
    .then((users) => users.filter((user) => user.dots.length > 0 || user.banInfo !== null));
};
