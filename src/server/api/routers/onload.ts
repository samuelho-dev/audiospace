import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductCategory, ProductSubcategory } from "@prisma/client";
import { prisma } from "~/server/db";
import { CategorySchema, ProductSchema } from "~/types/schema";

const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
});

// const CategorySchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   subcategories: z.array(SubcategorySchema),
//   _count: z.object({ products: z.number() }),
// });

export const onloadRouter = createTRPCRouter({
  getCategories: publicProcedure
    // .output(z.array(CategorySchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.productCategory.findMany({
        include: {
          subcategories: {
            include: {
              _count: {
                select: { products: true },
              },
            },
          },
        },
      });
      // console.log(data);
      return data;
    }),

  getFeaturedProducts: publicProcedure
    // .output(z.array(ProductSchema))
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.product.findMany({
        // where: {
        //   isPromoted: "FEATURED",
        // category: {
        //   name: "Effect",
        // },
        // },
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
});
