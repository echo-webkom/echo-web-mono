import { nanoid } from "nanoid";
import NextAuth from "next-auth";

import { createAuthOptions } from "@echo-webkom/auth";

import { setSignInAttempt } from "@/data/cache/sign-in-attempt";
import { toRelative } from "@/utils/url";

const authOptions = createAuthOptions({
  onSignInFail: async (event) => {
    console.info("Sign in failed", {
      ...event,
    });

    const id = nanoid();
    await setSignInAttempt(id, event.email, event.error);

    const url = new URL("https://abakus.no");
    url.pathname = "/auth/logg-inn";
    url.searchParams.append("attemptId", id);

    return toRelative(url);
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
