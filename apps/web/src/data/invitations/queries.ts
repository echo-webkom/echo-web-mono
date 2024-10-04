import { Invitation } from "@echo-webkom/db/schemas";

import { apiServer } from "@/api/server";
import { Happening } from "@/sanity.types";

export const getInvitations = async (userId: string) => {
  return await apiServer
    .get("/invitations", {
      json: {
        userId: userId,
      },
    })
    .json<Array<Invitation & { happening: Happening }>>();
};
