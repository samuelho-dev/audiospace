import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { api } from "~/utils/api";

export const cloudinaryRouter = createTRPCRouter({
  uploadImages: protectedProcedure
    .input(z.object({ folder: z.string(), images: z.array(z.string()) }))
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
      return data.map((img) => ({ imageUrl: img.secure_url }));
    }),
});
