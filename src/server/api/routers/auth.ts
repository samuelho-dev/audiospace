import { createTransport } from "nodemailer";
import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getCsrfToken, getProviders } from "next-auth/react";

export const authRouter = createTRPCRouter({
  getProviders: publicProcedure.query(async () => {
    const data = await getProviders();
    return data;
  }),
  csrfToken: publicProcedure.query(async () => {
    const csrfToken = await getCsrfToken();
    return csrfToken;
  }),
  signUp: publicProcedure
    .input(
      z.object({
        user: z.object({
          email: z.string(),
          username: z.string(),
          password: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userCheck = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            {
              email: input.user.email,
            },
            {
              username: input.user.username,
            },
          ],
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
            username: input.user.username,
            email: input.user.email,
            password: password,
            emailVerified: {
              create: {
                token: token,
                expires: expires,
              },
            },
          },
        });

        const data = { email: user.email, token, username: user.username };
        return data;
      }
    }),
  sendVerificationEmail: publicProcedure
    .input(z.object({ email: z.string(), token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const email = process.env.GMAIL_USER;
      // const pass = process.env.GMAIL_PASS;
      // const verificationLink = `https://localhost:3000/verify-request?token=${token}`;
      // const transporter = createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: email,
      //     pass,
      //   },
      // });
      // const mailOptions = {
      //   from: email,
      //   to: input.email,
      // };
      // try {
      //   await transporter.sendMail({
      //     ...mailOptions,
      //     subject: `Audiospace : Confirm your email`,
      //     text: `Please click the following link to verify your email: ${verificationLink}`,
      //     html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
      //   });
      // } catch (error) {
      //   console.error(error);
      //   throw new Error("Error sending email. Please try again.");
      // }
    }),
});
