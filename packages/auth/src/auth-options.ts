import {PrismaAdapter} from "@next-auth/prisma-adapter";
import type {DefaultSession, NextAuthOptions, User} from "next-auth";

import {prisma, type Degree, type Role} from "@echo-webkom/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    alternativeEmail?: string;
    role: Role;
    degree?: Degree;
    year?: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/sign-in",
  },

  callbacks: {
    session: ({session, user}) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  providers: [
    {
      id: "feide",
      name: "Feide",
      type: "oauth",
      wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "email userinfo-name profile userid openid groups-edu groups-org groups-other",
        },
      },
      clientId: process.env.FEIDE_CLIENT_ID,
      clientSecret: process.env.FEIDE_CLIENT_SECRET,
      idToken: true,

      profile: (
        profile: {
          sub: string;
          name: string;
          email: string;
          picture: string;
        } & User,
      ) => ({
        ...profile,
        id: profile.sub,
      }),
    },
  ],
};
