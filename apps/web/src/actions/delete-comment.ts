"use server";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";

export const deleteCommentAction = async (body: FormData) => {
  const id = body.get("id");

  if (!id || typeof id !== "string") {
    return {
      success: false,
      message: "Invalid id",
    };
  }

  const user = await auth();

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const success = await unoWithAdmin.comments.delete(id);
  if (!success) {
    return {
      success: false,
      message: "Failed to delete comment",
    };
  }

  return {
    success: true,
  };
};
