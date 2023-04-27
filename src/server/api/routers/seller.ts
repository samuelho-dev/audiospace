import Decimal from "decimal.js";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ProductSchema } from "~/types/schema";

export const sellerProfileRouter = createTRPCRouter({
  getSellerProduct: protectedProcedure
    .output(
      z.object({
        id: z.number(),
        userId: z.string(),
        products: z.array(ProductSchema),
      })
    )
    .query(({ ctx }) => {
      const data = ctx.prisma.seller.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
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
        price: z.instanceof(Decimal),
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
