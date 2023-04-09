import Link from "next/link";
import React from "react";

function battles() {
  return (
    <div className="w-full max-w-3xl lg:max-w-5xl">
      <div className="flex w-full justify-between border-b border-zinc-400 pb-4">
        <h3>Battles</h3>
        <Link href={"/battles/startbattle"}>
          <button className="rounded-lg p-2 outline outline-1 outline-zinc-500">
            Add a battle
          </button>
        </Link>
      </div>
      <div className="flex flex-col">
        <h5>Featured Battles</h5>
        <div>F</div>
      </div>
    </div>
  );
}

export default battles;
