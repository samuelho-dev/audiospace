import { useSession } from "next-auth/react";
import React, { useState } from "react";
import BattleAdminPanel from "~/components/battles/BattleAdminPanel";
import BattleEntry from "~/components/battles/BattleEntry";
import { type BattleEntrySchema } from "~/types/schema";
import { api } from "~/utils/api";

function Community() {
  const [submitActive, setSubmitActive] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const session = useSession();
  const battleQuery = api.battles.fetchCurrentBattle.useQuery();

  const battleEntriesQuery = api.battles.fetchCurrentEntries.useQuery();
  const submitEntryMutation = api.battles.submitBattleEntry.useMutation();
  const submitTrack = async () => {
    if (battleQuery.data) {
      await submitEntryMutation.mutateAsync({
        trackUrl: submitUrl,
        battleId: battleQuery.data.id,
      });
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col gap-8 lg:max-w-6xl">
      <h1>{`Love that you're here...`}</h1>
      <div>
        <h3>Live Events</h3>
        <div className="rounded-lg border border-zinc-400 p-2">
          <div className="flex justify-between">
            <div>
              <h5>Event Name</h5>
              <p className="text-xs">Location</p>
            </div>
            <div>Date</div>
          </div>
          <p>Description</p>
        </div>
      </div>
      <div>
        <h3>Previous Winners</h3>
        <div className="flex w-full justify-between rounded-lg border border-zinc-400 p-2">
          <h5>Artist Name</h5>
          <p>Link</p>
        </div>
      </div>
      {session.data?.user.role === "ADMIN" && <BattleAdminPanel />}
      <div className="flex flex-col rounded-lg p-2 outline outline-1 outline-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-400 pb-2">
          <div>
            <h3>Vote for your favorite beat - This Week</h3>

            {battleQuery.data && battleQuery.data.sample && (
              <button className="w-fit rounded-lg border border-zinc-400 px-4 text-xs">
                Download the sample
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {session.data?.user.role === "ADMIN" && (
              <button className="rounded-sm bg-yellow-300 px-2 text-black">
                Toggle Voting
              </button>
            )}
            {submitActive ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  placeholder="Enter your soundcloud url"
                  className="h-6 rounded-md px-2 text-black outline outline-1 outline-zinc-400"
                />
                <button
                  onClick={() => void submitTrack()}
                  className="rounded-lg px-2 outline outline-1 outline-zinc-400 hover:bg-zinc-600"
                >
                  Submit
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSubmitActive(true)}
                className="h-6 rounded-md px-2 outline outline-1 outline-zinc-400"
              >
                Submit A Track
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between border-b border-zinc-400 px-4 py-2">
          <h5 className="text-xs">Artist Name</h5>
          <h5 className="text-xs">Track</h5>
          <h5 className="text-xs">Vote</h5>
        </div>
        <div>
          {battleEntriesQuery.data &&
            battleEntriesQuery.data.map((entry: BattleEntrySchema) => (
              <BattleEntry key={entry.id} entry={entry} />
            ))}
        </div>
        <div className="flex justify-between border-t border-t-zinc-500 px-1 py-2">
          <h5>{battleEntriesQuery.data?.length} Entries</h5>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Community;
