import {adminProcedure, createTRPCRouter} from "../trpc";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ctx}) => {
    return await ctx.prisma.user.findMany();
  }),
});
