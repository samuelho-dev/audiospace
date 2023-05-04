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
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    await signUpMutation
      .mutateAsync({
        user: {
          username,
          email,
          password,
        },
      })
      .then(() =>
        signIn("credentials", {
          email,
          password,
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
      className="flex flex-col gap-4 py-2"
    >
      <h5>Sign Up with Email</h5>
      <label className="flex flex-row justify-between gap-10">
        Username:
        <input
          type="text"
          id="username"
          name="username"
          className="rounded-lg text-center text-black"
        />
      </label>
      <label className="flex flex-row justify-between gap-10">
        Email:
        <input
          type="text"
          id="email"
          name="email"
          className="rounded-lg text-center text-black"
        />
      </label>

      <label className="flex flex-row justify-between gap-10">
        Password:
        <input
          type="password"
          id="password"
          name="password"
          className="rounded-lg text-center text-black"
        />
      </label>
      <button
        type="submit"
        className="h-8 w-1/2 rounded-lg bg-yellow-400 text-lg text-black"
      >
        Create An Account
      </button>
    </form>
  );
}

export default CredentialSignUp;
