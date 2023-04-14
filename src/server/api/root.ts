import { createTRPCRouter } from "~/server/api/trpc";
import { onloadRouter } from "~/server/api/routers/onload";
import { authRouter } from "~/server/api/routers/auth";
import { userProfileRouter } from "./routers/userprofile";
import { pluginProductRouter } from "./routers/pluginProduct";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  plugins: pluginProductRouter,
  userprofile: userProfileRouter,
  onload: onloadRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
