import type { DefaultSession, NextAuthOptions, User } from "next-auth";

import { db } from "@echo-webkom/db";

import { DrizzleAdapter } from "./adapter";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
    alternativeEmail?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/logg-inn",
  },

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.alternativeEmail = user.alternativeEmail;
      }
      return session;
    },
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
      ) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          alternativeEmail: profile.alternativeEmail,
        };
      },
    },
  ],
};
