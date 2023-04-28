import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import uploadCloudinary from "~/utils/uploadCloudinary";
import uploadB2 from "~/utils/uploadB2";

export const adminRouter = createTRPCRouter({
  uploadProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        images: z.array(z.string()),
        previewTrack: z.string(),
        product: z.string(),
        sellerId: z.number(),
        categoryId: z.number(),
        subcategories: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const uploadPreviewTrack = await uploadB2(
        input.previewTrack,
        "AudiospacePlugins"
      );

      if (!uploadPreviewTrack) {
        throw new Error("Error uploading preview track");
      }
      const uploadProduct = await uploadB2(input.product, "AudiospacePlugins");

      if (!uploadProduct) {
        throw new Error("Error uploading product");
      }

      const uploadImages = await uploadCloudinary(
        input.images,
        "audiospace/product"
      );

      if (!uploadImages) {
        throw new Error("Error uploading images");
      }

      const uploadedProduct = await ctx.prisma.product.create({
        data: {
          sellerId: input.sellerId,
          name: input.name,
          images: {
            create: uploadImages,
          },
          categoryId: input.categoryId,
          subcategory: {
            connect: input.subcategories.map((subcategoryId) => ({
              id: subcategoryId,
            })),
          },
          description: input.description,
          price: input.price,
          previewUrl: uploadPreviewTrack,
          downloadUrl: uploadProduct,
        },
      });

      if (!uploadedProduct) {
        throw new Error("Error uploading product to DB");
      }

      return uploadedProduct;
    }),
  // createSeller: protectedProcedure
  //   .input(z.object({ name: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.seller.create({
  //       data : {}
  //     });

  //     return data;
  //   }),
});
