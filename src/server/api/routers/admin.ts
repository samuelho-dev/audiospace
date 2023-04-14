import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  createSeller: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.seller.create({
        data: {
          name: input.name,
        },
      });

      return data;
    }),
});
