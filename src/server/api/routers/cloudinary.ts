import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ratelimit } from "~/server/redis/rateLimit";

export const cloudinaryRouter = createTRPCRouter({
  uploadImages: protectedProcedure
    .input(z.object({ folder: z.string(), images: z.array(z.string()) }))
    .output(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const identifier = ctx.session.user.id;

      const { success } = await ratelimit.limit(identifier);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Please try again in a a few moments",
        });
      }

      const options = {
        unique_filename: true,
        overwrite: true,
        folder: `audiospace/${input.folder}`,
      };

      const data = await Promise.all(
        input.images.map((image) =>
          ctx.cloudinary.uploader.upload(image, options)
        )
      ).catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error occured uploading images, please try again",
        });
      });
      return data.map((img) => img.secure_url);
    }),
});
