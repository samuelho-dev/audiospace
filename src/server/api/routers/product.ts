import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { CategorySchema, SubcategorySchema } from "~/types/schema";

export const productRouter = createTRPCRouter({
  getMainFeaturedProducts: publicProcedure.query(async ({ ctx, input }) => {
    const data = await ctx.prisma.product.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        seller: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        name: true,
        images: true,
        category: true,
        subcategory: true,
        price: true,
        previewUrl: true,
        discountRate: true,
        wishlistUsers: true,
      },
    });
    return data;
  }),
  getFilteredProducts: publicProcedure
    .input(
      z
        .object({
          categories: z.array(z.string()).optional(),
          subcategories: z.array(z.string()).optional(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      const where: {
        category?: { name: { in: string[] } };
        subcategory?: { some: { name: { in: string[] } } };
      } = {};

      if (
        typeof input?.categories?.length === "number" &&
        input?.categories?.length > 0
      ) {
        where.category = { name: { in: input.categories } };
      }
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
          seller: {
            select: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          subcategory: true,
          category: true,
          name: true,
          images: true,
          price: true,
          previewUrl: true,
          discountRate: true,
          wishlistUsers: true,
        },
      });
      // console.log(data);
      return data;
    }),
  getNewProducts: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: input.category,
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          seller: {
            select: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          name: true,
          images: true,
          category: true,
          subcategory: true,
          price: true,
          previewUrl: true,
          discountRate: true,
          wishlistUsers: true,
        },
      });
      // console.log(data);
      return data;
    }),
  getFeaturedProducts: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          isPromoted: "FEATURED",
          category: {
            name: input.category,
          },
        },
        take: 5,
        select: {
          id: true,
          seller: {
            select: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          name: true,
          images: true,
          category: true,
          subcategory: true,
          price: true,
          previewUrl: true,
          discountRate: true,
          wishlistUsers: true,
        },
      });
      // console.log(data);
      return data;
    }),
  getPopularPerCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: input.category,
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
          seller: {
            select: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          name: true,
          images: true,
          category: true,
          subcategory: true,
          price: true,
          previewUrl: true,
          discountRate: true,
          wishlistUsers: true,
        },
      });
      // console.log(data);
      return data;
    }),
  getProductInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      return data;
    }),
});
