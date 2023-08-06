import {getServerSession as _getServerSession} from "next-auth/next";

import {authOptions} from "@echo-webkom/auth";

import {getUserById} from "./queries/user";

export const getUser = async () => {
  const session = await _getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return null;
  }

  return user;
};
