import { createTransport } from "nodemailer";
import { JWT } from "next-auth/jwt";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { api } from "~/utils/api";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        user: z.object({ email: z.string(), password: z.string() }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userCheck = await ctx.prisma.user.findFirst({
        where: {
          email: input.user.email,
        },
      });

      if (userCheck) {
        throw new Error("User already exists, please sign in");
      } else if (!userCheck) {
        const password = await bcrypt.hash(input.user.password, 10);

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 24);

        const user = await ctx.prisma.user.create({
          data: {
            email: input.user.email,
            password: password,
          },
        });

        const emailVerification = await ctx.prisma.emailVerification.create({
          data: {
            userId: user.id,
            token: token,
            expires: expires,
          },
          select: {
            token: true,
          },
        });

        const data = { email: user.email, token: emailVerification.token };
        return data;
      }
    }),
  sendVerificationEmail: publicProcedure
    .input(z.object({ email: z.string(), token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const email = process.env.GMAIL_USER;
      const pass = process.env.GMAIL_PASS;
      const verificationLink = ``;
      // https://${process.env.NEXT_PUBLIC_VERCEL_URL}/verify-email?token=${token}
      const transporter = createTransport({
        service: "gmail",
        auth: {
          user: email,
          pass,
        },
      });
      const mailOptions = {
        from: email,
        to: input.email,
      };

      try {
        await transporter.sendMail({
          ...mailOptions,
          subject: `Audiospace : Confirm your email`,
          text: `Please click the following link to verify your email: ${verificationLink}`,
          html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Error sending email. Please try again.");
      }
    }),
});
