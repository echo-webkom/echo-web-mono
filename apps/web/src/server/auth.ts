import {type GetServerSidePropsContext} from "next";
import {getServerSession, type NextAuthOptions, type DefaultSession} from "next-auth";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {env} from "@/env.mjs";
import {prisma} from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
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
          scope: "email userinfo-name profile userid openid groups-edu groups-org groups-other",
        },
      },
      clientId: env.FEIDE_CLIENT_ID,
      clientSecret: env.FEIDE_CLIENT_SECRET,
      idToken: true,
      // TODO: Remove all eslint-disable comments when we have a better solution
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
