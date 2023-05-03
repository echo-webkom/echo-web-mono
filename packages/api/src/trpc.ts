import {TRPCError, initTRPC} from "@trpc/server";
import {type CreateNextContextOptions} from "@trpc/server/adapters/next";
import superjson from "superjson";
import {ZodError} from "zod";

import {getServerSession, type Session} from "@echo-webkom/auth";
import {prisma} from "@echo-webkom/db/client";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const {req, res} = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerSession({req, res});

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({shape, error}) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ctx, next}) => {
  if (!ctx.session?.user) {
    throw new TRPCError({code: "UNAUTHORIZED"});
  }
  return next({
    ctx: {
      session: {...ctx.session, user: ctx.session.user},
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(({ctx, next}) => {
  if (ctx.session?.user?.role !== "ADMIN") {
    throw new TRPCError({code: "UNAUTHORIZED"});
  }
  return next({
    ctx: {
      session: {...ctx.session, user: ctx.session.user},
    },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
