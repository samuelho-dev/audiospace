import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

function StartBattle() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    void router.push("/auth/signin");
  }
  if (status === "authenticated") {
    return (
      <form>
        <h2>Start a</h2>
      </form>
    );
  }
}

export default StartBattle;
