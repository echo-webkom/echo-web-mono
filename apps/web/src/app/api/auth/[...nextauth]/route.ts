import NextAuth from "next-auth";
import { log } from "next-axiom";

import { createAuthOptions } from "@echo-webkom/auth";

const authOptions = createAuthOptions({
  onSignInFail: (event) => {
    log.info("Sign in failed", {
      ...event,
    });
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
