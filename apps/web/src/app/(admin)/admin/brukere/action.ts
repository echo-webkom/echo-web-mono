<<<<<<< HEAD
<<<<<<< HEAD
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
=======
"use server"
=======
"use server";
>>>>>>> 4c28961 (lint and formatting)

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
<<<<<<< HEAD
        message: "You are not logged in",
>>>>>>> 75207b8 (onSubmit shows toast🎉)
=======
        message: "You are not logged in as an admin",
>>>>>>> 489e9b0 (added isAdmin button)
      };
    }

    await prisma.user.update({
      where: {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
        id: userId
=======
        id: userId,
>>>>>>> 4c28961 (lint and formatting)
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
<<<<<<< HEAD
    }

>>>>>>> 75207b8 (onSubmit shows toast🎉)
=======
    };
>>>>>>> 4c28961 (lint and formatting)
  } catch (error) {
    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 75207b8 (onSubmit shows toast🎉)
=======
>>>>>>> 4c28961 (lint and formatting)
