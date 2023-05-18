import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const blobRouter = createTRPCRouter({
  createProductDescriptionBlob: protectedProcedure
    .input(z.object({ content: z.string() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const byte: Buffer = Buffer.from(input.content);

      const data = await ctx.prisma.productDescriptionBlob.create({
        data: {
          data: byte,
        },
        select: {
          id: true,
        },
      });
      if (!data) {
        throw new Error("Blob upload error");
      }

      return data;
    }),
  createBlogPostBlob: protectedProcedure
    .input(z.object({ content: z.string() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const byte: Buffer = Buffer.from(input.content, "utf-8");

      const data = await ctx.prisma.postContentBlob.create({
        data: {
          data: byte,
        },
        select: {
          id: true,
        },
      });

      if (!data) {
        throw new Error("Blob upload error");
      }

      return data;
    }),
});
