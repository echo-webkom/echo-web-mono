import {z} from "zod";

import {createTRPCRouter, publicProcedure, protectedProcedure} from "@/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure.input(z.object({text: z.string()})).query(({input}) => {
    return {
      greeting: `Hello ${input.text}`,
    };
  }),

  helloSecret: protectedProcedure.input(z.object({text: z.string()})).query(({input}) => {
    return {
      greeting: `The name is ${input.text}`,
    };
  }),
});
