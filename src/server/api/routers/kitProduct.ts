import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const kitProductRouter = createTRPCRouter({
  getFilteredKitProducts: publicProcedure
    .input(
      z
        .object({
          subcategories: z.array(z.string()).optional(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      const where: {
        subcategory?: { some: { name: { in: string[] } } };
      } = {};

      if (
        typeof input?.subcategories?.length === "number" &&
        input?.subcategories?.length > 0
      ) {
        where.subcategory = { some: { name: { in: input.subcategories } } };
      }

      const data = await ctx.prisma.product.findMany({
        where: where,
        select: {
          id: true,
          seller: true,
          subcategory: true,
          category: true,
          name: true,
          images: true,
          price: true,
          preview_url: true,
          discount_rate: true,
          wishlist_users: true,
        },
      });
      // console.log(data);
      return data;
    }),
  getFeaturedKitProducts: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.product.findMany({
      where: {
        isPromoted: "FEATURED",
        category: {
          name: "Kits",
        },
      },
      select: {
        id: true,
        seller: true,
        name: true,
        images: true,
        category: true,
        subcategory: true,
        price: true,
        preview_url: true,
        discount_rate: true,
        wishlist_users: true,
      },
    });
    // console.log(data);
    return data;
  }),
  getPopularKits: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: "Kits",
          },
        },
        take: 5,
        orderBy: {
          transactions: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          seller: true,
          name: true,
          images: true,
          category: true,
          subcategory: true,
          price: true,
          preview_url: true,
          discount_rate: true,
          wishlist_users: true,
        },
      });
      console.log(data);
      return data;
    }),
  getPopularEffects: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: "Effects",
          },
        },
        take: 5,
        orderBy: {
          transactions: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          seller: true,
          name: true,
          images: true,
          category: true,
          subcategory: true,
          price: true,
          preview_url: true,
          discount_rate: true,
          wishlist_users: true,
        },
      });
      console.log(data);
      return data;
    }),
});
