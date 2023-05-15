import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const blobRouter = createTRPCRouter({
  createBlob: protectedProcedure
    .input(z.object({ content: z.string() }))
    .output(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const byte: Buffer = Buffer.from(input.content, "utf-8");

      const data = await ctx.prisma.blob.create({
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
