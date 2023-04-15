import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "../trpc";

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        name: z.string().max(100).optional(),
        message: z.string().min(5).max(500),
      }),
    )
    .mutation(async ({ctx, input}) => {
      return await ctx.prisma.siteFeedback.create({
        data: {
          email: input.email,
          name: input.name,
          message: input.message,
        },
      });
    }),
});
