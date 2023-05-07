import {getServerSession as _getServerSession} from "next-auth/next";

import {authOptions} from "@echo-webkom/auth";

export async function getServerSession() {
  const session = await _getServerSession(authOptions);

  return session;
}
