import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

interface AuthModalProps {
  handleDropdown: (dropdownName: string | null) => void;
}

export default function AuthModal({ handleDropdown }: AuthModalProps) {
  const [formSubmitType, setFormSubmitType] = useState(false);
  const handleFormType = () => setFormSubmitType(!formSubmitType);
  const signUpMutation = api.auth.signUp.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const username = (form.username as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      if (formSubmitType) {
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
            })
          )
          .then(() => handleDropdown(null));

        // await verificationEmailMutation.mutateAsync({
        //   email: user?.email as string,
        //   token: user?.token as string,
        // });
      } else {
        await signIn("credentials", {
          username,
          password,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className="absolute left-0 top-0 z-40 h-full w-full bg-zinc-950 bg-opacity-50"
        onClick={() => handleDropdown(null)}
      />
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className=" absolute left-1/2 top-1/2 z-50 w-fit -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-lg bg-zinc-900 p-4 outline outline-1 outline-zinc-700"
      >
        <h1>audio.space</h1>
        <h3>{formSubmitType ? "Create an Account" : "Sign In"}</h3>
        <div className="flex flex-col gap-8 py-10">
          {formSubmitType && (
            <label className="flex flex-row justify-between gap-10">
              Email address:
              <input
                type="email"
                id="email"
                name="email"
                className="rounded-lg text-center text-black"
              />
            </label>
          )}

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
            Password:
            <input
              type="password"
              id="password"
              name="password"
              className="rounded-lg text-center text-black"
            />
          </label>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleFormType}
            className="rounded-lg px-2 py-1 text-xs outline outline-1 outline-zinc-700 hover:bg-zinc-800"
          >
            {formSubmitType ? "Sign In" : "Create An Account"}
          </button>
          <button
            type="submit"
            className="h-8 w-1/2 rounded-lg bg-yellow-400 text-lg text-black"
          >
            {formSubmitType ? "Create An Account" : "Sign In"}
          </button>
        </div>
      </form>
    </>
  );
}
