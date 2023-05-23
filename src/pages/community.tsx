import { PrismaClient } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import BattleAdminPanel from "~/components/battles/BattleAdminPanel";
import BattleEntry from "~/components/battles/BattleEntry";
import { type BattleSchema, type BattleEntrySchema } from "~/types/schema";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

interface SubmitTrackProps {
  submitTrack: (submitUrl: string) => Promise<void>;
}

function SubmitTrackForm({ submitTrack }: SubmitTrackProps) {
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitInputActive, setSubmitInputActive] = useState(false);

  if (submitInputActive) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          onChange={(e) => setSubmitUrl(e.target.value)}
          placeholder="Enter your soundcloud url"
          className="h-6 rounded-md px-2 text-black outline outline-1 outline-zinc-400"
        />
        <button
          onClick={() => void submitTrack(submitUrl)}
          className="rounded-lg px-2 outline outline-1 outline-zinc-400 hover:bg-zinc-600"
        >
          Submit
        </button>
      </div>
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
  pastEntries: any[];
}

function Community({ curBattle, pastEntries }: CommunityProps) {
  const session = useSession();
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
        throw new Error("Invalid Url");
      }

      if (curBattle) {
        await submitEntryMutation.mutateAsync({
          trackUrl: submitUrl,
          battleId: curBattle.id,
        });
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error occured during submission. Please try again", err);
    }
  };
  console.log(pastEntries);
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
      {session.data?.user.role === "ADMIN" && <BattleAdminPanel />}

      <div className="flex flex-col rounded-lg p-2 ">
        <div className="flex w-full flex-col justify-between p-2">
          <h4>Past Winners</h4>
          <div className="flex w-full justify-between border-b border-zinc-400 px-4 py-2">
            <p className="text-xs">Submitted</p>
            <p className="text-xs">Artist Name</p>
            <p className="text-xs">Track</p>
            <p className="text-xs">Rating</p>
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
                  <h5 className=" overflow-hidden text-sm">
                    {entry.winner.subimittedAt.toLocaleString()}
                  </h5>
                  <h5 className="w-32 overflow-hidden text-sm">
                    {entry.winner.user.username}
                  </h5>
                  <iframe
                    allow="autoplay"
                    src={soundCloudUrl(entry.winner.trackUrl)}
                    height="20"
                  ></iframe>
                  <h5>{entry.winner.rating}</h5>
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
                <p>Status: {curBattle?.isActive || "Closed"}</p>
              </div>

              {curBattle && curBattle.sample && (
                <a
                  href={samplePresignUrl?.data}
                  target="_blank"
                  className="w-fit rounded-md bg-green-400 px-2 text-xs font-semibold text-black"
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
                <SubmitTrackForm submitTrack={submitTrack} />
              )}
            </div>
          </div>

          <div className="flex justify-between border-b border-zinc-400 px-4 py-2">
            <h5 className="text-xs">Artist Name</h5>
            <h5 className="text-xs">Track</h5>
            <h5 className="text-xs">Vote</h5>
          </div>
          <div className="m-2 h-96 rounded-sm bg-zinc-900">
            {curBattle ? (
              battleEntriesQuery.data ? (
                battleEntriesQuery.data.map((entry: BattleEntrySchema) => (
                  <BattleEntry
                    key={entry.id}
                    entry={entry}
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
            <button>Next</button>
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
          subimittedAt: true,
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
