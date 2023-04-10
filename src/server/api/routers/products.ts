import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductCategory, ProductSubcategory } from "@prisma/client";
import { prisma } from "~/server/db";
import {
  CategorySchema,
  SellerSchema,
  SubcategorySchema,
} from "~/types/schema";

export const productRouter = createTRPCRouter({
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

      console.log(input);
      const data = await ctx.prisma.product.findMany({
        where: where,
        select: {
          id: true,
          seller: true,
          subcategory: true,
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
});
