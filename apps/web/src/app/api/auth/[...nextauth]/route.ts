import * as va from "@vercel/analytics/server";
import NextAuth from "next-auth";

import { createAuthOptions } from "@echo-webkom/auth";

const authOptions = createAuthOptions({
  onSignInFail: async (event) => {
    await va.track("Sign in failed", {
      ...event,
    });
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
