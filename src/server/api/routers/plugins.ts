import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { CategorySchema, ProductSchema } from "~/types/schema";

export const onloadRouter = createTRPCRouter({
  getPopularEffect: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        where: {
          category: {
            name: "Effect",
          },
        },
        take: 10,
        orderBy: {
          transactions: {
            _count: "desc",
          },
        },
      });

      return data;
    }),

  getPopularInstruments: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        take: 10,
        orderBy: {
          transactions: {
            _count: "desc",
          },
        },
      });

      return data;
    }),
});
