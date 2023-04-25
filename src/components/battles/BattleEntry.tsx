import { useState } from "react";
import { type ZodError } from "zod";
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
      <h5 className="text-sm">{entry.user.username}</h5>
      <iframe
        allow="autoplay"
        src={soundCloudUrl(entry.trackUrl)}
        height="20"
      ></iframe>
      {voted ? (
        <h5 className="text-sm">Voted</h5>
      ) : (
        <button onClick={() => void handleVote()} className="text-sm">
          Vote
        </button>
      )}
    </div>
  );
}

export default BattleEntry;
