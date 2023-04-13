import { type GetServerSidePropsContext } from "next";

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;

      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.name = user.username;
      }
      console.log({ token }, "JWT callback");
      return token;
    },
    session({ session, user, token }) {
      console.log(session, "session callback");
      if (session.user) {
        session.user.id = token.sub;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    signIn({ user, account, profile, email, credentials }) {
      console.log({ user, credentials }, "signin callback");
      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Sign In with..",
      credentials: {
        email: { label: "Email", type: "email" },
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirstOrThrow({
          where: {
            OR: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          },
        });
        if (user && credentials) {
          const check = await bcrypt.compare(
            credentials?.password,
            user.password as string
          );
          if (check) {
            console.log(credentials, "CREDEENNT");
            return user;
          } else {
            throw new Error("Password does not match");
          }
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

/**
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
