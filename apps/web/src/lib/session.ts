import {getServerSession as _getServerSession} from "next-auth/next";

import {authOptions} from "@echo-webkom/auth";
import {getUserById} from "@echo-webkom/db/queries/user";

export async function getUser() {
  const session = await _getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return null;
  }

  return user;
}

export async function getServerSession() {
  return await _getServerSession(authOptions);
}
