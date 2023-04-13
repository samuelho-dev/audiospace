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
        <h2>Start a battle</h2>
        <div className="flex flex-col">
          <label>
            Title: <input type="text" />
          </label>
          <div>
            <label>Description:</label>
            <input type="text" />
          </div>
          <label className="mb-2 block text-sm font-medium text-white">
            Upload Profile Picture
          </label>
          <input
            id="profileImg"
            name="profileImg"
            type="file"
            multiple={true}
            accept="mp3/*, wav/*"
            className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </form>
    );
  }
}

export default StartBattle;
