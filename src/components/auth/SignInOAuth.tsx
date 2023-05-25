import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { AiOutlineApple, AiOutlineGoogle } from "react-icons/ai";
import { RxDiscordLogo } from "react-icons/rx";

interface SignInOAuthProps {
  loginToggle: boolean;
  setRoute: (dropdownName: string | null) => void;
}

function SignInOAuth({ setRoute, loginToggle }: SignInOAuthProps) {
  const authProviders = api.auth.getProviders.useQuery();

  if (!authProviders.data) {
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="py-2">{loginToggle ? "Log in" : "Sign Up"}</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => void signIn("google")}
          className="flex h-10 items-center gap-4 rounded-lg bg-blue-500 px-4 "
        >
          <AiOutlineGoogle size={20} />
          <h5 className="text-lg font-medium">
            Continue with {authProviders.data.google.name}
          </h5>
        </button>
        {/* <button
          onClick={() => void signIn("apple")}
          className="flex h-10 items-center gap-4 rounded-lg bg-zinc-100 px-4"
        >
          <AiOutlineApple fill="black" size={20} />
          <h5 className="text-lg font-medium text-black">
            Continue with Apple
          </h5>
        </button> */}
        <button
          onClick={() => void signIn("discord")}
          className="flex h-10 items-center gap-4 rounded-lg bg-indigo-700 px-4 "
        >
          <RxDiscordLogo size={20} />
          <h5 className="text-lg font-medium">Continue with Discord</h5>
        </button>

        {loginToggle ? (
          <div className="flex flex-col gap-2 py-2">
            <button
              onClick={() => setRoute("sign-in-email")}
              className="bg-zinc-800 text-sm font-medium"
            >
              LOGIN WITH EMAIL
            </button>
            <button
              onClick={() => setRoute("sign-up-oauth")}
              className="text-sm"
            >
              {`Don't have an account? `}
              <span className="hover:underline hover:underline-offset-4">
                Sign Up
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-2">
            <button
              onClick={() => setRoute("sign-up-email")}
              className="bg-zinc-800 text-sm font-medium"
            >
              CREATE ACCOUNT WITH EMAIL
            </button>
            <button
              onClick={() => setRoute("sign-in-oauth")}
              className="text-sm"
            >
              {`Already have an account? `}
              <span className="hover:underline hover:underline-offset-4">
                Log In
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default SignInOAuth;
