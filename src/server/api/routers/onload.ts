import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const onloadRouter = createTRPCRouter({
  getAllSellers: publicProcedure
    .output(
      z.array(
        z.object({ id: z.number(), user: z.object({ username: z.string() }) })
      )
    )
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.seller.findMany({
        select: {
          id: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      // console.log(data);
      return data;
    }),
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.productCategory.findMany({});
    // console.log(data);
    return data;
  }),
  getSelectedSubcategories: publicProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.productSubcategory.findMany({
        where: {
          categoryId: input.categoryId,
        },
      });
      // console.log(data);
      return data;
    }),
  getPluginCategories: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.productCategory.findMany({
      where: {
        OR: [
          {
            name: "Effects",
          },
          {
            name: "Instruments",
          },
        ],
      },
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
  getKitCategories: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.productCategory.findMany({
      where: {
        name: "Kits",
      },
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
});
