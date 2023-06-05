/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { type GetServerSidePropsContext } from "next";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { prisma } from "./db";
import { env } from "~/env.mjs";
import sgMail from "./sendgrid/sendgrid";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    accessToken: string;
  }
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    name: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        return true;
      }

      let username = user.email.split("@")[0].replace(".", "-");
      let usernameCheck = await prisma.user.findUnique({
        where: { username },
      });
      let count = 1;
      while (usernameCheck) {
        username = `${usernameCheck.username}${count}`;
        usernameCheck = await prisma.user.findUnique({
          where: { username },
        });
        count++;
      }

      await prisma.user.create({
        data: {
          email: user.email,
          username: username,
        },
      });

      // console.log({ user, credentials }, "signin callback");
      return true;
    },
    jwt({ token, account, profile, user }) {
      if (account && user) {
        token.role = user.role;
        token.name = user.username;
        token.id = user.id;
        // console.log({ token, account, user }, "jwt callback");
      }
      return token;
    },
    session({ session, user, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.id = token.id;
      }

      // console.log({ token, session, user }, "session callback");
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // AppleProvider({
    //   clientId: env.APPLE_ID,
    //   clientSecret: env.APPLE_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: "welcome@audiospace.app",
      sendVerificationRequest({ identifier: email, url }) {
        const templateId = "d-4f0a825b6f2841ca900af5be6efe602f";

        void sgMail
          .send({
            from: "welcome@audiospace.app",
            to: email,
            templateId,
            dynamicTemplateData: {
              url,
            },
          })
          .catch(() => new Error("Verification email could not be sent."));
      },
    }),
  ],
};

/**s
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
