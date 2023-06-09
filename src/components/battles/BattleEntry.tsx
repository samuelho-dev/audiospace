import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { type BattleEntrySchema } from "~/types/schema";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

interface BattleEntryProps {
  entry: BattleEntrySchema;
  votingPhase: boolean;
  setErrorState: (string: string) => void;
}

function BattleEntry({ entry, votingPhase, setErrorState }: BattleEntryProps) {
  const [voted, setVoted] = useState(false);
  const voteMutation = api.battles.voteEntry.useMutation();
  const userLikedQuery = api.battles.getUserLikedBattleEntry.useQuery();
  const handleVote = async () => {
    try {
      await voteMutation.mutateAsync({
        entryId: entry.id,
      });

      setVoted(true);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        setErrorState(err.message);
      } else {
        setErrorState("Unknown Error Occurred");
      }
    }
  };

  return (
    <div className="flex justify-between border-zinc-400 px-4 py-4">
      <h5 className="w-1/4 overflow-hidden text-center text-sm">
        {entry.user.username}
      </h5>
      <iframe
        allow="autoplay"
        src={soundCloudUrl(entry.trackUrl)}
        height="20"
      ></iframe>
      <div className="flex w-1/4 items-center justify-center">
        <input
          type="checkbox"
          onClick={() => void handleVote()}
          disabled={
            voted ||
            votingPhase ||
            (userLikedQuery.data && userLikedQuery.data.includes(entry.id))
          }
        />
      </div>
    </div>
  );
}

export default BattleEntry;
