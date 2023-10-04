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
      };
    }

    await prisma.user.update({
      where: {
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

  } catch (error) {
    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};

