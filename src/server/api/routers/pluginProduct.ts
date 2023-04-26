import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const pluginProductRouter = createTRPCRouter({
  getFeaturedPluginProducts: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.product.findMany({
      where: {
        isPromoted: "FEATURED",
        category: {
          name: "Effect",
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
        preview_url: true,
        discount_rate: true,
        wishlist_users: true,
      },
    });
    // console.log(data);
    return data;
  }),
  getPopularInstruments: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: "Instruments",
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
          description: true,
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
          seller: {
            select: {
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
          description: true,
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
});
