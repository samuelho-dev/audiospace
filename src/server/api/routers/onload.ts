import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const onloadRouter = createTRPCRouter({
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
        OR: [
          {
            name: "Kits",
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
});
