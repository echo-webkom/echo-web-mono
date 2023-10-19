"use server";

import { eq } from "drizzle-orm";
import { type z } from "zod";

import { db } from "@echo-webkom/db";
import { users, usersToGroups } from "@echo-webkom/db/schemas";

import { getUser } from "@/lib/session";
import { type userFormSchema } from "./schemas";

type Response =
  | {
      result: "success";
    }
  | {
      result: "error";
      message: string;
    };

export const updateUserAction = async (
  userId: string,
  data: z.infer<typeof userFormSchema>,
): Promise<Response> => {
  try {
    const actionUser = await getUser();

    if (actionUser === null || actionUser?.type !== "admin") {
      return {
        result: "error",
        message: "You are not logged in as an admin",
      };
    }

    await db.delete(usersToGroups).where(eq(usersToGroups.userId, userId));
    await db.insert(usersToGroups).values(data.memberships.map((groupId) => ({ userId, groupId })));
    await db.update(users).set({ type: data.type }).where(eq(users.id, userId));

    return {
      result: "success",
    };
  } catch (error) {
    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};
