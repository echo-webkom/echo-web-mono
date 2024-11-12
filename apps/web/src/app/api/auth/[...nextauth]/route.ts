import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import NextAuth from "next-auth";

import { createAuthOptions } from "@echo-webkom/auth";

import { signInAttempt } from "@/data/kv/namespaces";
import { toRelative } from "@/utils/url";

const authOptions = createAuthOptions({
  onSignInFail: async (event) => {
    console.info("Sign in failed", {
      ...event,
    });

    const id = nanoid();
    await signInAttempt.set(
      id,
      {
        email: event.email,
        error: event.error,
      },
      addMinutes(new Date(), 5),
    );

    const url = new URL("https://abakus.no");
    url.pathname = "/auth/logg-inn";
    url.searchParams.append("attemptId", id);

    return toRelative(url);
  },
});

// @ts-expect-error wtf
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
