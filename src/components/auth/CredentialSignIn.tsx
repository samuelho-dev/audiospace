import { type SignInResponse, signIn } from "next-auth/react";
import React, { useState } from "react";

interface CredentialLoginProps {
  loginToggle: boolean;
}

function CredentialLogin({ loginToggle }: CredentialLoginProps) {
  const [errorState, setErrorState] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    })
      .then((response: SignInResponse | undefined) => {
        console.log(response);
        if (!response) {
          setErrorState("An error occurred during sign in.");
          return;
        }
        const { ok, error } = response;
        if (!ok && error) {
          setErrorState("Failed Sign in");
        }
      })
      .catch((err: string) => {
        console.error(err);
      });
  };
  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <label>Email Address</label>
        <input
          type="text"
          id="email"
          name="email"
          className="rounded-lg text-center text-black"
        />
      </div>
      <div className="flex flex-col">
        <label>Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="rounded-lg text-center text-black"
        />
      </div>
      <div className="flex flex-col py-4">
        <button className="border border-zinc-700 bg-zinc-800">LOG IN</button>
        <button className="text-sm">Forgot your password?</button>
      </div>
    </form>
  );
}

export default CredentialLogin;
