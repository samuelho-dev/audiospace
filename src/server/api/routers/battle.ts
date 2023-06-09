import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { ratelimit } from "~/server/redis/rateLimit";
import { type BattleEntrySchema } from "~/types/schema";
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
      const identifier = ctx.session.user.id;

      const { success } = await ratelimit.limit(identifier);

      if (!success) {
        throw new Error("Please try again in a a few moment");
      }

      const battleStatus = await ctx.prisma.battle.findFirst({
        where: {
          id: input.battleId,
        },
      });

      if (
        battleStatus?.isActive === "VOTING" ||
        battleStatus?.isActive === "ENDED"
      ) {
        throw new Error(`Submissions Closed`);
      }

      const entryExists = await ctx.prisma.battleEntry.findFirst({
        where: {
          battleId: input.battleId,
          userId: ctx.session.user.id,
        },
      });

      if (entryExists) {
        throw new Error("You have already submitted");
      }

      const data = ctx.prisma.battleEntry.create({
        data: {
          userId: ctx.session.user.id,
          trackUrl: input.trackUrl,
          battleId: input.battleId,
        },
      });
      return data;
    }),
  fetchCurrentBattle: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.battle.findFirstOrThrow({
      where: {
        OR: [{ isActive: "ACTIVE" }, { isActive: "VOTING" }],
      },
    });
    return data;
  }),
  fetchCurrentEntries: publicProcedure.query(async ({ ctx }) => {
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
  fetchPastBattles: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.battle.findMany({
      where: {
        isActive: "ENDED",
      },
      select: {
        id: true,
        winner: {
          select: {
            id: true,
            user: {
              select: {
                username: true,
              },
            },
            trackUrl: true,
            rating: true,
            submittedAt: true,
          },
        },
      },
    });

    return data;
  }),
  voteEntry: protectedProcedure
    .input(
      z.object({
        entryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const identifier = ctx.session.user.id;

      const { success } = await ratelimit.limit(identifier);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are requesting too quickly, please try again later.",
        });
      }

      const voteExists = await ctx.prisma.battleVote.findFirst({
        where: {
          battleEntryId: input.entryId,
          userId: ctx.session.user.id,
        },
      });

      if (voteExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already voted for this track",
        });
      }

      await ctx.prisma.battleVote.create({
        data: {
          battleEntryId: input.entryId,
          userId: ctx.session.user.id,
        },
      });

      const data = await ctx.prisma.battleEntry.update({
        where: {
          id: input.entryId,
        },
        data: {
          rating: {
            increment: 1,
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
    .input(z.object({ battleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const curBattle = await ctx.prisma.battle.findFirstOrThrow({
        where: {
          isActive: "VOTING",
        },
      });

      const curBattleEntries = await ctx.prisma.battleEntry.findMany({
        where: {
          battleId: curBattle.id,
        },
        orderBy: [
          {
            votes: {
              _count: "desc",
            },
          },
        ],
      });

      if (!curBattleEntries[0]) {
        throw new Error("No entries");
      }
      const data = await ctx.prisma.battle.update({
        where: {
          id: curBattle.id,
        },
        data: {
          isActive: "ENDED",
          winnerEntryId: curBattleEntries[0].id,
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
            winner: {
              connect: {
                id: currBattle.entries[0]?.id,
              },
            },
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
  getUserLikedBattleEntry: protectedProcedure.query(async ({ ctx }) => {
    const votes = await ctx.prisma.battleVote.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        battleEntryId: true,
      },
    });

    const data = votes.map((entry) => entry.battleEntryId);
    return data;
  }),
});
