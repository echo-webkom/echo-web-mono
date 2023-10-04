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

import { type z } from "zod";
import { type userFormSchema } from "./schemas";
import { type Group, prisma } from "@echo-webkom/db";
import { getUser } from "@/lib/session";

type Response =
| {
    result: "success";
  }
| {
    result: "error";
    message: string;
  };


export const updateUserAction = async (
  userId : string,
  data :  z.infer<typeof userFormSchema>
) : Promise<Response> => {
  try {
    const actionUser = await getUser();

    if (actionUser === null || actionUser?.role !=="ADMIN") {
      return {
        result: "error",
        message: "You are not logged in",
>>>>>>> 75207b8 (onSubmit shows toast🎉)
      };
    }

    await prisma.user.update({
      where: {
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
      },
      data: {
        studentGroups: {
          set: data.groups as Array<Group>
        }
      }
    })

    return {
      result: "success",
    }

>>>>>>> 75207b8 (onSubmit shows toast🎉)
  } catch (error) {
    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};
<<<<<<< HEAD
=======

>>>>>>> 75207b8 (onSubmit shows toast🎉)
