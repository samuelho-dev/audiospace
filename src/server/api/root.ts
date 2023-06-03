import { createTRPCRouter } from "~/server/api/trpc";
import { onloadRouter } from "~/server/api/routers/onload";
import { authRouter } from "~/server/api/routers/auth";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { battleRouter } from "./routers/battle";
import { sellerRouter } from "./routers/seller";
import { blogRouter } from "./routers/blog";
import { b2Router } from "./routers/s3";
import { cloudinaryRouter } from "./routers/cloudinary";
import { paypalRouter } from "./routers/paypal";

export const appRouter = createTRPCRouter({
  user: userRouter,
  seller: sellerRouter,
  battles: battleRouter,
  products: productRouter,
  onload: onloadRouter,
  blog: blogRouter,
  auth: authRouter,
  b2: b2Router,
  cloudinary: cloudinaryRouter,
  paypal: paypalRouter,
});

export type AppRouter = typeof appRouter;
