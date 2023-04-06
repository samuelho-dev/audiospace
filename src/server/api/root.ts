import { createTRPCRouter } from "~/server/api/trpc";
import { onloadRouter } from "~/server/api/routers/onload";
import { mailRouter } from "~/server/api/routers/mail";
import { userProfileRouter } from "./routers/userprofile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  userprofile: userProfileRouter,
  onload: onloadRouter,
  mail: mailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
