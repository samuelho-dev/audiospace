import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { BattleEntrySchema, BattleSchema } from "~/types/schema";
import { shuffle } from "~/utils/randomArray";

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
    .input(z.object({ trackUrl: z.string().url(), battleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
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
          userId: ctx.session?.user.id,
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
  fetchCurrentBattle: publicProcedure
    .output(BattleSchema)
    .query(async ({ ctx }) => {
      const data = ctx.prisma.battle.findFirstOrThrow({
        where: {
          OR: [{ isActive: "ACTIVE" }, { isActive: "VOTING" }],
        },
      });
      return data;
    }),
  fetchCurrentEntries: publicProcedure
    .output(z.array(BattleEntrySchema))
    .query(async ({ ctx }) => {
      const currBattle = await ctx.prisma.battle.findFirstOrThrow({
        where: {
          OR: [{ isActive: "ACTIVE" }, { isActive: "VOTING" }],
        },
      });

      if (!currBattle) {
        throw new Error("No active battle found.");
      }

      const data = await ctx.prisma.battleEntry.findMany({
        where: {
          battleId: currBattle.id,
        },
        select: {
          battleId: true,
          id: true,
          rating: true,
          trackUrl: true,
          userId: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (data.length === 0) {
        throw new Error("No entries yet.");
      }
      // console.log(data);
      const result = shuffle(data) as BattleEntrySchema[];
      return result;
    }),
  voteEntry: protectedProcedure
    .input(z.object({ entryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const voteExists = await ctx.prisma.battleEntry.findFirst({
        where: {
          id: input.entryId,
          likedBy: {
            every: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      console.log(voteExists, "vote exists");
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
  toggleBattleVoting: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
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
  endCurrentBattle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const currBattle = await ctx.prisma.battle.findFirst({
        where: {
          isActive: "VOTING",
        },
        select: {
          id: true,
          entries: {
            orderBy: [
              {
                rating: "desc",
              },
            ],
            take: 5,
          },
        },
      });
      console.log(currBattle);
      if (!currBattle) {
        throw new Error("There is no active battle");
      }

      const data = await ctx.prisma.battle.update({
        where: {
          id: currBattle.id,
        },
        data: {
          isActive: "ENDED",
          winnerId: currBattle.entries[0]?.userId,
          endedAt: new Date(),
        },
      });

      return data;
    }),

  endBattleandCreate: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        sample: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currBattle = await ctx.prisma.battle.findFirst({
        where: {
          isActive: "ACTIVE",
        },
        select: {
          id: true,
          entries: {
            orderBy: [
              {
                rating: "desc",
              },
            ],
            take: 5,
          },
        },
      });

      if (currBattle) {
        await ctx.prisma.battle.update({
          where: {
            id: currBattle.id,
          },
          data: {
            isActive: "ENDED",
            winnerId: currBattle.entries[0]?.userId,
            endedAt: new Date(),
          },
        });
      }
      const data = await ctx.prisma.battle.create({
        data: {
          description: input.description,
          sample: input.sample,
        },
      });
      return data;
    }),
});
