import { type GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";

interface SignInProps {
  csrfToken: string;
}

export default function SignIn({ csrfToken }: SignInProps) {
  return (
    <form
      method="post"
      action="/api/auth/signin/email"
      className="flex w-2/5 flex-col items-center"
    >
      <h1>audio.space</h1>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label className="flex flex-row justify-between gap-2 py-8">
        Email address:
        <input
          type="email"
          id="email"
          name="email"
          className="rounded-lg px-2 text-center text-black"
        />
      </label>

      <button
        type="submit"
        className="h-16 w-1/2 rounded-lg bg-yellow-400 text-xl text-black"
      >
        Sign In
      </button>
    </form>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
