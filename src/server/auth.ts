import { type GetServerSidePropsContext } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User,
} from "next-auth";
import { env } from "../env.mjs";
import { prisma } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
  }
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
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
  },
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      // console.log({ user, credentials }, "signin callback");
      return true;
    },
    jwt({ token, account, profile, user }) {
      if (user) {
        token.accessToken = account?.access_token;
        token.id = user.id;
        token.name = user.name;

        token.email = user.email;
        token.role = user.role;
      }
      // console.log({ token }, "JWT callback");
      return token;
    },
    session({ session, user, token }) {
      if (session.user) {
        (session.user as User & DefaultSession["user"]).role = token.role;
        (session.user as User & DefaultSession["user"]).id = token.id;
      }

      // console.log({ token, session }, "session callback");
      return session;
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
        if (credentials) {
          try {
            const user = await prisma.user.findFirstOrThrow({
              where: {
                OR: [
                  { email: credentials?.email },
                  { username: credentials?.username },
                ],
              },
              select: {
                id: true,
                username: true,
                email: true,
                password: true,
                role: true,
              },
            });

            if (user) {
              const passwordMatch = await bcrypt.compare(
                credentials.password,
                user.password
              );
              if (passwordMatch) {
                return user;
              }
            }
          } catch (err) {
            throw err;
          }
        }
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
