import {TRPCError} from "@trpc/server";
import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";

export const happeningRouter = createTRPCRouter({
  register: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const event = await ctx.prisma.happening.findUnique({
        where: {
          slug: input.slug,
        },
      });
      if (!event) {
        throw new TRPCError({message: "Happening not found", code: "NOT_FOUND"});
      }

      if (!event.registrationStart || !event.registrationEnd) {
        throw new TRPCError({
          message: "Registration is not open",
          code: "NOT_FOUND",
        });
      }

      if (event.registrationEnd < new Date()) {
        throw new TRPCError({
          message: "Registration deadline has passed",
          code: "NOT_FOUND",
        });
      }

      if (event.registrationStart > new Date()) {
        throw new TRPCError({
          message: "Registration has not started yet",
          code: "NOT_FOUND",
        });
      }

      const range = await ctx.prisma.spotRange.findFirst({
        where: {
          happeningSlug: input.slug,
          maxDegreeYear: {
            gte: ctx.session.user.year,
          },
          minDegreeYear: {
            lte: ctx.session.user.year,
          },
        },
      });
      if (!range) {
        throw new TRPCError({
          message: "No spots available for your degree",
          code: "NOT_FOUND",
        });
      }

      return await ctx.prisma.$transaction(async (prisma) => {
        const registrationCount = await prisma.happening.count({
          where: {
            slug: input.slug,
            registrations: {
              some: {
                status: "REGISTERED",
              },
            },
            spotRanges: {
              some: {
                id: range.id,
              },
            },
          },
        });

        const registrationStatus = registrationCount < range.spots ? "REGISTERED" : "WAITLISTED";

        const registration = await prisma.registration.upsert({
          where: {
            userId_happeningSlug: {
              happeningSlug: input.slug,
              userId: ctx.session.user.id,
            },
          },
          update: {
            status: registrationStatus,
          },
          create: {
            status: registrationStatus,
            happeningSlug: input.slug,
            userId: ctx.session.user.id,
          },
        });

        return registration.status;
      });
    }),

  deregister: protectedProcedure
    .input(z.object({slug: z.string()}))
    .mutation(async ({ctx, input}) => {
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
          questions: true,
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
        registeredCount,
        isAlreadyRegistered,
      };
    }),
});
