"use server";

import { type z } from "zod";

import { prisma, type Group, type Role } from "@echo-webkom/db";

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

    if (actionUser === null || actionUser?.role !== "ADMIN") {
      return {
        result: "error",
        message: "You are not logged in as an admin",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        studentGroups: {
          set: data.groups as Array<Group>,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: data.role as Role,
      },
    });

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
