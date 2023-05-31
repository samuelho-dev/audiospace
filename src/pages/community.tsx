import { PrismaClient } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import BattleAdminPanel from "~/components/battles/BattleAdminPanel";
import BattleEntry from "~/components/battles/BattleEntry";
import {
  type BattleSchema,
  type BattleEntrySchema,
  type PastBattleSchema,
} from "~/types/schema";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

interface SubmitTrackProps {
  submitTrack: (submitUrl: string) => Promise<void>;
  errorState: string | null;
}

function SubmitTrackForm({ submitTrack, errorState }: SubmitTrackProps) {
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitInputActive, setSubmitInputActive] = useState(false);

  if (submitInputActive) {
    return (
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void submitTrack(submitUrl);
        }}
      >
        <input
          type="text"
          onChange={(e) => setSubmitUrl(e.target.value)}
          required
          placeholder="Enter your soundcloud url"
          className={`h-6 rounded-md px-2  outline outline-1 outline-zinc-400 ${
            errorState ? "border border-pink-400 text-pink-500" : "text-black"
          }`}
        />
        <button
          type="submit"
          className="rounded-lg px-2 outline outline-1 outline-zinc-400 hover:bg-zinc-600"
        >
          Submit
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setSubmitInputActive(true)}
      className="h-6 rounded-md px-2 outline outline-1 outline-zinc-400"
    >
      Submit A Track
    </button>
  );
}

interface CommunityProps {
  curBattle: BattleSchema | null;
  pastEntries: PastBattleSchema[];
}

function Community({ curBattle, pastEntries }: CommunityProps) {
  const session = useSession();
  const [errorState, setErrorState] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // const battleQuery = api.battles.fetchCurrentBattle.useQuery();
  const samplePresignUrl = curBattle?.sample
    ? api.b2.getStandardDownloadPresignedUrl.useQuery(
        {
          bucket: "AudiospaceSamples",
          key: curBattle.sample,
        },
        { enabled: !!curBattle.sample }
      )
    : null;

  const battleEntriesQuery = api.battles.fetchCurrentEntries.useQuery();

  const submitEntryMutation = api.battles.submitBattleEntry.useMutation();
  const toggleBattleVotingMutation =
    api.battles.toggleBattleVoting.useMutation();
  const endBattleMutation = api.battles.endCurrentBattle.useMutation();

  const handleBattleToggle = async () => {
    try {
      if (curBattle) {
        await toggleBattleVotingMutation.mutateAsync({
          id: curBattle.id,
        });
      }
    } catch (err) {
      console.error("Error occured during voting toggle", err);
    }
  };

  const handleBattleEnd = async () => {
    try {
      if (curBattle) {
        await endBattleMutation.mutateAsync({
          battleId: curBattle.id,
        });
      }
    } catch (err) {
      console.error("Error occured during ending battle", err);
    }
  };

  const submitTrack = async (submitUrl: string) => {
    try {
      const soundcloudUrlValidation =
        /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
      if (!soundcloudUrlValidation.test(submitUrl)) {
        setErrorState(
          "Invalid Url. Please make sure you are submitting a soundcloud url."
        );
        throw new Error("Invalid Url");
      }

      if (curBattle) {
        await submitEntryMutation.mutateAsync({
          trackUrl: submitUrl,
          battleId: curBattle.id,
        });
        setSubmitted(true);
        setErrorState(null);
      }
    } catch (err) {
      console.error("Error occured during submission. Please try again", err);
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-grow flex-col gap-8 lg:max-w-6xl">
      <dialog
        open={!!errorState}
        className="sticky top-0 w-full rounded-sm bg-zinc-800 opacity-90"
      >
        <h1>Oops!</h1>
        <p className="text-red-400">{errorState}</p>
      </dialog>

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
      {session.data?.user.role === "ADMIN" && <BattleAdminPanel />}

      <div className="flex flex-col rounded-lg p-2 ">
        <div className="flex w-full flex-col justify-between p-2">
          <h4>Past Winners</h4>
          <div className="flex w-full justify-between border-b border-zinc-400 px-4 py-2">
            <p className="w-1/6 text-center text-xs ">Submitted</p>
            <p className="w-2/6 text-center text-xs ">Artist Name</p>
            <p className="w-2/6 text-center text-xs ">Track</p>
            <p className="w-1/6 text-center text-xs ">Rating</p>
          </div>
          <div className="m-2 h-40 overflow-scroll rounded-sm bg-zinc-900">
            {pastEntries.length === 0 ? (
              <div>Pending</div>
            ) : (
              pastEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex w-full justify-between border-zinc-400 px-4 py-4"
                >
                  <h5 className="flex w-1/6 justify-center  overflow-hidden text-sm">
                    {entry.winner.submittedAt.toLocaleDateString()}
                  </h5>
                  <h5 className="flex w-2/6 justify-center  overflow-hidden text-sm">
                    {entry.winner.user.username}
                  </h5>
                  <iframe
                    allow="autoplay"
                    className="flex w-2/6 justify-center  overflow-x-hidden"
                    src={soundCloudUrl(entry.winner.trackUrl)}
                    height="20"
                  ></iframe>
                  <h5 className="flex w-1/6 justify-center">
                    {entry.winner.rating}
                  </h5>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col p-2">
          <div className="flex items-center justify-between border-b border-zinc-400 pb-2">
            <div>
              <div className="flex flex-col">
                <h3>Beat Battle</h3>
                <p>{curBattle?.description}</p>
                <p className="text-sm">
                  Status: {curBattle?.isActive || "Closed"}
                </p>
              </div>

              {curBattle && curBattle.sample && (
                <a
                  href={samplePresignUrl?.data}
                  target="_blank"
                  className="w-fit rounded-md bg-emerald-400 px-2 text-xs font-semibold text-black"
                >
                  DOWNLOAD THE SAMPLE
                </a>
              )}
            </div>
            <div className="flex gap-2">
              {session.data?.user.role === "ADMIN" && (
                <div className="flex gap-2">
                  {curBattle && curBattle.isActive === "VOTING" ? (
                    <button
                      onClick={() => void handleBattleEnd()}
                      className="rounded-sm bg-rose-600 px-2 text-white"
                    >
                      END BATTLE
                    </button>
                  ) : (
                    <button
                      onClick={() => void handleBattleToggle()}
                      className="rounded-sm bg-yellow-300 px-2 text-black"
                    >
                      Toggle Voting
                    </button>
                  )}
                </div>
              )}
              {submitted ? (
                <h5 className="rounded-lg border border-zinc-100 px-2">
                  Submitted
                </h5>
              ) : (
                <SubmitTrackForm
                  errorState={errorState}
                  submitTrack={submitTrack}
                />
              )}
            </div>
          </div>

          <div className="flex w-full justify-between border-b border-zinc-400 px-4 py-2">
            <h5 className="w-1/4 text-center text-xs">Artist Name</h5>
            <h5 className="w-2/4 text-center text-xs">Track</h5>
            <h5 className="w-1/4 text-center text-xs">Vote</h5>
          </div>
          <div className="m-2 h-96 overflow-scroll rounded-sm bg-zinc-900">
            {curBattle ? (
              battleEntriesQuery.data ? (
                battleEntriesQuery.data.map((entry: BattleEntrySchema) => (
                  <BattleEntry
                    key={entry.id}
                    entry={entry}
                    setErrorState={setErrorState}
                    votingPhase={curBattle.isActive === "ACTIVE"}
                  />
                ))
              ) : (
                <div>Battle is active, submit your track.</div>
              )
            ) : (
              <div>There are no active battles currently.</div>
            )}
          </div>
          <div className="flex justify-between border-t border-t-zinc-500 px-1 py-2">
            <h5>{battleEntriesQuery.data?.length || 0} Entries</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  const curBattle = await prisma.battle.findFirst({
    where: {
      OR: [{ isActive: "ACTIVE" }, { isActive: "VOTING" }],
    },
  });

  const pastEntries = await prisma.battle.findMany({
    where: {
      isActive: "ENDED",
    },
    orderBy: {
      winner: {
        rating: "desc",
      },
    },
    select: {
      id: true,
      winner: {
        select: {
          id: true,
          user: {
            select: {
              username: true,
            },
          },
          trackUrl: true,
          submittedAt: true,
          rating: true,
        },
      },
    },
  });

  return {
    props: {
      curBattle: curBattle ? curBattle : null,
      pastEntries,
    },
  };
};
