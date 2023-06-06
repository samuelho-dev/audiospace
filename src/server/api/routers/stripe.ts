import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const stripeRouter = createTRPCRouter({
  sellerAccountCreate: protectedProcedure.mutation(async ({ ctx, input }) => {
    const account = await ctx.stripe.accounts.create({
      type: "standard",
      email: ctx.session.user.email,
    });

    if (!account) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error creating stripe account",
      });
    }

    const accountLink = await ctx.stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${env.NEXTAUTH_URL}/profile?section=seller-signup`,
      return_url: `${env.NEXTAUTH_URL}/seller/onboaring/finish`,
      type: "account_onboarding",
    });

    return accountLink.url;
  }),
});
