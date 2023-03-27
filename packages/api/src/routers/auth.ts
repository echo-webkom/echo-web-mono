import {Degree, Year} from "@echo-webkom/db";
import {z} from "zod";

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
        degree: z.nativeEnum(Degree).nullable(),
        year: z.nativeEnum(Year).nullable(),
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
    });
  }),
});
