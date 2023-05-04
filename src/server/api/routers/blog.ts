import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { encode } from "~/utils/quickHash";

import uploadB2 from "~/utils/uploadB2";

export const blogRouter = createTRPCRouter({
  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.post.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      return data;
    }),
  getBlogPosts: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.post.findMany({
      where: {},
      include: {
        tag: true,
      },
      take: 20,
    });

    return data;
  }),
  getBlogTags: publicProcedure.query(async ({ ctx }) => {
    const data = ctx.prisma.tag.findMany({});
    return data;
  }),
  uploadBlogPosts: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        file: z.string(),
        blogTag: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.post.create({
        data: {
          id: encode(input.title.replace(" ", "-").toLowerCase()),
          title: input.title,
          description: input.description,
          contentUrl: input.file,
          tag: {
            connect: {
              id: input.blogTag,
            },
          },
        },
      });

      return data;
    }),
});
