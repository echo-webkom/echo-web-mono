import { unoWithAdmin } from "@/api/server";

export const getCommentsById = (id: string) => {
  return unoWithAdmin.comments.all(id);
};
