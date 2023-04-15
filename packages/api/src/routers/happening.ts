import {TRPCError} from "@trpc/server";
import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";
import {userIsAlreadyRegistered} from "../utils/happening";

export const happeningRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const registration = await ctx.prisma.registration.upsert({
        where: {
          userId_happeningSlug: {
            happeningSlug: input.slug,
            userId: ctx.session.user.id,
          },
        },
        update: {
          status: "REGISTERED",
        },
        create: {
          happeningSlug: input.slug,
          userId: ctx.session.user.id,
          status: "REGISTERED",
        },
      });

      return registration.status;
    }),

  unregister: protectedProcedure
    .input(z.object({slug: z.string()}))
    .mutation(async ({ctx, input}) => {
      const isAlreadyRegistered = await userIsAlreadyRegistered(
        ctx.prisma,
        input.slug,
        ctx.session.user.id,
      );

      if (!isAlreadyRegistered) {
        throw new TRPCError({
          message: "Not registered",
          code: "NOT_FOUND",
        });
      }

      const registration = await ctx.prisma.registration.update({
        where: {
          userId_happeningSlug: {
            happeningSlug: input.slug,
            userId: ctx.session.user.id,
          },
        },
        data: {
          status: "DEREGISTERED",
        },
      });

      return registration.status;
    }),

  get: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const happening = await ctx.prisma.happening.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          spotRanges: true,
        },
      });

      if (!happening) {
        throw new TRPCError({message: "Happening not found", code: "NOT_FOUND"});
      }

      const registeredCount = await ctx.prisma.registration.count({
        where: {
          happeningSlug: input.slug,
          status: "REGISTERED",
        },
      });

      const isAlreadyRegistered =
        ctx.session?.user.id &&
        (await ctx.prisma.registration.count({
          where: {
            happeningSlug: input.slug,
            userId: ctx.session.user.id,
            status: "REGISTERED",
          },
        })) > 0;

      return {
        ...happening,
        totalSpots: happening.spotRanges.reduce((acc, range) => acc + range.spots, 0),
        registeredCount: registeredCount ?? 0,
        isAlreadyRegistered,
      };
    }),
});
