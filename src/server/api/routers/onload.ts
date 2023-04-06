import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductCategory, ProductSubcategory } from "@prisma/client";
import { prisma } from "~/server/db";

const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  categoryId: z.number(),
});

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  subcategories: z.array(SubcategorySchema),
});

export const onloadRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),
  // getCategories: publicProcedure.query(({ ctx }) => {
  //   return prisma.productCategory.findMany();
  // }),
  getCategories: publicProcedure
    .output(z.promise(z.array(CategorySchema)))
    .query(async ({ ctx }): Promise<any> => {
      const data = await ctx.prisma.productCategory.findMany({
        include: {
          subcategories: true,
        },
      });
      return data;
    }),
});
