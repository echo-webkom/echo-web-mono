import {createNextApiHandler} from "@trpc/server/adapters/next";
import {appRouter, createTRPCContext} from "@echo-webkom/api";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
