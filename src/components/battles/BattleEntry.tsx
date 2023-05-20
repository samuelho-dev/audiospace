import { useState } from "react";
import { type BattleEntrySchema } from "~/types/schema";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

interface BattleEntryProps {
  entry: BattleEntrySchema;
  votingPhase: boolean;
}

function BattleEntry({ entry, votingPhase }: BattleEntryProps) {
  const [voted, setVoted] = useState(false);
  const voteMutation = api.battles.voteEntry.useMutation();

  const handleVote = async () => {
    try {
      await voteMutation.mutateAsync({ entryId: entry.id });
      setVoted(true);
    } catch (err) {
      console.error(err);
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
      <input
        type="checkbox"
        onClick={() => void handleVote()}
        disabled={voted || votingPhase}
        className="flex text-sm"
      />
    </div>
  );
}

export default BattleEntry;
