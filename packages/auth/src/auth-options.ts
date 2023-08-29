import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";

import { prisma, type Degree, type Role } from "@echo-webkom/db";

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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/sign-in",
  },

  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.alternativeEmail = user.alternativeEmail;
        session.user.degree = user.degree;
        session.user.year = user.year;
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
          role: profile.role,
          degree: profile.degree,
          year: profile.year,
        };
      },
    },
  ],
};
