import {authRouter} from "./routers/auth";
import {feedbackRouter} from "./routers/feedback";
import {happeningRouter} from "./routers/happening";
import {userRouter} from "./routers/user";
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
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
