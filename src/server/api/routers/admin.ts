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
      try {
        const uploadPreviewTrack = await uploadB2(
          input.previewTrack,
          "AudiospacePlugins"
        );
        const uploadProduct = await uploadB2(
          input.product,
          "AudiospacePlugins"
        );
        const uploadImages = await uploadCloudinary(
          input.images,
          "audiospace/product"
        );
        const uploadedProduct = await ctx.prisma.product.create({
          data: {
            name: input.name,
            description: input.description,
            price: input.price,
            images: {
              create: uploadImages,
            },
            preview_url: uploadPreviewTrack,
            download_url: uploadProduct,
            sellerId: input.sellerId,
            categoryId: input.categoryId,
            subcategory: {
              connect: input.subcategories.map((subcategoryId) => ({
                id: subcategoryId,
              })),
            },
          },
        });
        await ctx.prisma.$disconnect();
        return uploadedProduct;
      } catch (err) {
        console.error("Product upload failed", err);
      }
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
