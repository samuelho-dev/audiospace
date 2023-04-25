import { useState } from "react";
import { type BattleEntrySchema } from "~/types/schema";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

interface BattleEntryProps {
  entry: BattleEntrySchema;
}

function BattleEntry({ entry }: BattleEntryProps) {
  const [voted, setVoted] = useState(false);
  const voteMutation = api.battles.voteEntry.useMutation();

  const handleVote = async () => {
    try {
      await voteMutation.mutateAsync({ entryId: entry.id });
      setVoted(true);
    } catch (err) {
      console.error(err);
      setVoted(true);
    }
  };

  return (
    <div className="flex justify-between border-zinc-400 px-4 py-4">
      <h5 className="w-32 overflow-hidden text-sm">{entry.user.username}</h5>
      <iframe
        allow="autoplay"
        src={soundCloudUrl(entry.trackUrl)}
        height="20"
      ></iframe>
      {voted ? (
        <p className="w-20 text-right text-sm">Voted</p>
      ) : (
        <button
          onClick={() => void handleVote()}
          className="w-20 text-right text-sm"
        >
          Vote
        </button>
      )}
    </div>
  );
}

export default BattleEntry;
