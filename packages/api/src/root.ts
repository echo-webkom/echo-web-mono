import {authRouter} from "./routers/auth";
import {feedbackRouter} from "./routers/feedback";
import {happeningRouter} from "./routers/happening";
import {createTRPCRouter} from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  happening: happeningRouter,
  feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
