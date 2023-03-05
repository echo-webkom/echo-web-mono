import {PrismaAdapter} from "@next-auth/prisma-adapter";
import type {DefaultSession, NextAuthOptions} from "next-auth";
import {prisma} from "@echo-webkom/db";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({session, user}) {
      session.user.id = user.id;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "feide",
      name: "Feide",
      type: "oauth",
      wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
      authorization: {
        params: {
          scope:
            "email userinfo-name profile userid openid groups-edu groups-org groups-other",
        },
      },
      clientId: process.env.FEIDE_CLIENT_ID,
      clientSecret: process.env.FEIDE_CLIENT_SECRET,
      idToken: true,
      profile: (profile: any) => {
        return {
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          /* eslint-enable @typescript-eslint/no-unsafe-assignment */
          /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        };
      },
    },
  ],
};
