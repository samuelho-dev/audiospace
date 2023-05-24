import { type SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";

interface CredentialSignUpProps {
  setErrorState: (error: string | null) => void;
}

function CredentialSignUp({ setErrorState }: CredentialSignUpProps) {
  const signUpMutation = api.auth.signUp.useMutation();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const email = (form.email as HTMLInputElement).value;
    await signUpMutation
      .mutateAsync({
        user: {
          email,
        },
      })
      .then(() =>
        signIn("email", {
          email,
          redirect: false,
        }).then((response: SignInResponse | undefined) => {
          if (!response) {
            setErrorState("An error occurred during sign in.");
            return;
          }
          const { ok, error } = response;
          if (!ok && error) {
            setErrorState("Failed Sign in");
          }
        })
      )
      .then(() => {
        router.reload();
      })
      .catch((err: string) => {
        console.error(err);
      });
  };
  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex w-full flex-col items-center gap-4"
    >
      <h5 className="w-full items-start gap-2">Sign Up with Email</h5>

      <div className="flex w-full flex-col items-start justify-between">
        <label>Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          className="rounded-lg text-center text-black"
        />
      </div>
      <button
        type="submit"
        className="text-md h-8 whitespace-nowrap rounded-lg bg-yellow-400 px-2 font-semibold text-black"
      >
        CREATE ACCOUNT
      </button>
    </form>
  );
}

export default CredentialSignUp;
