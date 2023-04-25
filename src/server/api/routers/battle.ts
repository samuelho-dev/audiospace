import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const battleRouter = createTRPCRouter({
  createBattle: protectedProcedure.query(async ({ ctx }) => {
    const data = ctx.prisma.battle.create({
      data: {
        description: "Weekly Beat Battle",
      },
    });
    return data;
  }),
  submitBattleEntry: protectedProcedure
    .input(z.object({ trackUrl: z.string(), battleId: z.number() }))
    .query(async ({ ctx, input }) => {
      const battleStatus = await ctx.prisma.battle.findFirst({
        where: {
          id: input.battleId,
        },
      });

      if (
        battleStatus?.isActive === "VOTING" ||
        battleStatus?.isActive === "ENDED"
      ) {
        throw new Error(`Submissions are now closed, we'll see you next week`);
      }

      const entryExists = await ctx.prisma.battleEntry.findFirst({
        where: {
          userId: ctx.session.user.id,
          battleId: input.battleId,
        },
      });

      if (entryExists) {
        throw new Error("You have already submitted");
      }

      const data = ctx.prisma.battleEntry.create({
        data: {
          userId: ctx.session?.user.id,
          trackUrl: input.trackUrl,
          battleId: input.battleId,
        },
      });
      return data;
    }),
  fetchCurrentBattle: publicProcedure.query(async ({ ctx }) => {
    const data = ctx.prisma.battle.findFirstOrThrow({
      where: {
        isActive: "ACTIVE",
      },
    });
    return data;
  }),
  toggleBattleVoting: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.battle.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: "VOTING",
        },
      });
      return data;
    }),
  voteEntry: protectedProcedure
    .input(z.object({ entryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const voteExists = await ctx.prisma.battleEntry.findFirst({
        where: {
          user: {
            id: ctx.session.user.id,
          },
        },
      });

      if (voteExists) {
        throw new Error("You have already voted");
      }

      const data = await ctx.prisma.battleEntry.update({
        where: {
          id: input.entryId,
        },
        data: {
          rating: { increment: 1 },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return data;
    }),
  endBattle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.battle.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: "ENDED",
        },
      });
      return data;
    }),
});
