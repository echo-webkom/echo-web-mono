import { getServerSession as _getServerSession } from "next-auth/next";

import { authOptions } from "@echo-webkom/auth";

import { getUserById } from "./queries/user";

export async function getSession() {
  const session = await _getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return session;
}

export async function getUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const { data, error } = await getUserById(session.user.id);

  if (!data || error) {
    return null;
  }

  return data;
}
