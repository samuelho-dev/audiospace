import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserNav from "~/components/UserNav";
import { api } from "~/utils/api";

function Navbar() {
  const { data: session } = useSession();
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );
  return (
    <nav className="flex w-full max-w-3xl items-center justify-between gap-4 lg:max-w-5xl">
      <Link href={"/"}>
        <h1>audio.space</h1>
      </Link>
      <div className="flex gap-8">
        <Link href={"/Plugins"}>
          <h3>Plugins</h3>
        </Link>
        <Link href={"/Deals"}>
          <h3>Deals</h3>
        </Link>
        <Link href={"/Battles"}>
          <h3>Battles</h3>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!session ? (
          <button
            onClick={() => void signIn()}
            className="rounded-full bg-yellow-300 px-4 py-1 text-black"
          >
            Sign In
          </button>
        ) : (
          <UserNav />
        )}
        <button>
          <h3 className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            🛒
          </h3>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
