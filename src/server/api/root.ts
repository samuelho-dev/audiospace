import { createTRPCRouter } from "~/server/api/trpc";
import { onloadRouter } from "~/server/api/routers/onload";
import { authRouter } from "~/server/api/routers/auth";
import { userProfileRouter } from "./routers/userprofile";
import { pluginProductRouter } from "./routers/pluginProduct";
import { kitProductRouter } from "./routers/kitProduct";
import { productRouter } from "./routers/product";
import { battleRouter } from "./routers/battle";
import { sellerProfileRouter } from "./routers/seller";
import { blogRouter } from "./routers/blog";
import { b2Router } from "./routers/s3";
import { cloudinaryRouter } from "./routers/cloudinary";
import { blobRouter } from "./routers/blob";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  battles: battleRouter,
  plugins: pluginProductRouter,
  kits: kitProductRouter,
  products: productRouter,
  userprofile: userProfileRouter,
  sellerprofile: sellerProfileRouter,
  onload: onloadRouter,
  blog: blogRouter,
  auth: authRouter,
  b2: b2Router,
  cloudinary: cloudinaryRouter,
  blob: blobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
