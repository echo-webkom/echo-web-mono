import {z} from "zod";

import {Degree} from "@echo-webkom/db/types";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ctx}) => {
    return ctx.session;
  }),

  update: protectedProcedure
    .input(
      z.object({
        alternativeEmail: z
          .string()
          .email()
          .nullable()
          .or(z.literal(""))
          .transform((v) => (v === "" ? null : v)),
        degree: z.nativeEnum(Degree).nullable().optional(),
        year: z.number().min(1).max(5).nullable().optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });
    }),

  me: protectedProcedure.query(({ctx}) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Registration: {
          include: {
            happening: true,
          },
        },
      },
    });
  }),
});
