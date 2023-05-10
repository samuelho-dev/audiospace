import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const cloudinaryRouter = createTRPCRouter({
  uploadImages: protectedProcedure
    .input(z.object({ folder: z.string(), images: z.array(z.string()) }))
    .output(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      const options = {
        unique_filename: true,
        overwrite: true,
        folder: `audiospace/${input.folder}`,
      };

      const data = await Promise.all(
        input.images.map((image) =>
          ctx.cloudinary.uploader.upload(image, options)
        )
      );
      return data.map((img) => img.secure_url);
    }),
});
