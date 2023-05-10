import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductSchema } from "~/types/schema";
import uploadB2 from "~/utils/uploadB2";
import uploadCloudinary from "~/utils/uploadCloudinary";

export const sellerProfileRouter = createTRPCRouter({
  uploadProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        images: z.array(z.string()),
        previewTrack: z.string(),
        product: z.string(),
        categoryId: z.number(),
        subcategories: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      const sellerId = await ctx.prisma.seller.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!sellerId.id) {
        throw new Error("User is not a seller");
      }
      const uploadPreviewTrack = await uploadB2(
        input.previewTrack,
        "AudiospaceProducts"
      );

      if (!uploadPreviewTrack) {
        throw new Error("Error uploading preview track");
      }
      const uploadProduct = await uploadB2(input.product, "AudiospaceProducts");

      if (!uploadProduct) {
        throw new Error("Error uploading product");
      }

      const uploadedProduct = await ctx.prisma.product.create({
        data: {
          sellerId: sellerId.id,
          name: input.name,
          images: {
            create: input.images.map((file) => ({
              imageUrl: file,
            })),
          },
          categoryId: input.categoryId,
          subcategory: {
            connect: input.subcategories.map((subcategoryId) => ({
              id: subcategoryId,
            })),
          },
          description: input.description,
          price: input.price,
          discountRate: 0,
          previewUrl: uploadPreviewTrack,
          downloadUrl: uploadProduct,
        },
      });

      if (!uploadedProduct) {
        throw new Error("Error uploading product to DB");
      }

      return uploadedProduct;
    }),
  getSellerProfileProductandCategories: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          seller: {
            include: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          description: true,
          category: true,
          subcategory: true,
          name: true,
          images: true,
          price: true,
          discountRate: true,
        },
      });

      const uniqueCategories = new Set();
      const uniqueSubcategories = new Set();

      for (const product of data) {
        uniqueCategories.add(product.category);
        uniqueSubcategories.add(product.subcategory);
      }
      return {
        products: data,
        categories: Array.from(uniqueCategories),
        subcategories: Array.from(uniqueSubcategories),
      };
    }),
  getSellerProduct: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .output(
      z.object({
        id: z.number(),
        userId: z.string(),
        products: z.array(ProductSchema),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.seller.findFirstOrThrow({
        where: {
          userId: input.userId,
        },
        include: {
          products: {
            select: {
              id: true,
              seller: {
                include: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              description: true,
              category: true,
              subcategory: true,
              name: true,
              images: true,
              price: true,
              discountRate: true,
            },
          },
        },
      });
      return data;
    }),
  updateSellerProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().min(5),
        price: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const seller = await ctx.prisma.seller.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const data = await ctx.prisma.product.updateMany({
        where: {
          sellerId: seller.id,
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
        },
      });
      return data;
    }),
});
