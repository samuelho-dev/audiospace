import React, { useState } from "react";
import soundCloudUrl from "~/utils/soundcloudUrl";

function Community() {
  const [submitActive, setSubmitActive] = useState(false);
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 lg:max-w-5xl">
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
          <p>Audio</p>
        </div>
      </div>
      <div className="flex flex-col rounded-lg p-2 outline outline-1 outline-zinc-200">
        <div className="flex items-center justify-between border-b border-zinc-400 pb-2">
          <div>
            <h3>Vote for your favorite beat - This Week</h3>

            <button className="w-fit rounded-lg border border-zinc-400 px-4 text-xs">
              Download the sample
            </button>
          </div>
          {submitActive ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your soundcloud url"
                className="h-6 rounded-md px-2 outline outline-1 outline-zinc-400"
              />
              <button className="rounded-lg px-2 outline outline-1 outline-zinc-400 hover:bg-zinc-600">
                Submit
              </button>
            </div>
          ) : (
            <button
              onClick={void setSubmitActive(true)}
              className="h-6 rounded-md px-2 outline outline-1 outline-zinc-400"
            >
              Submit A Track
            </button>
          )}
        </div>

        <div className="flex justify-between border-b border-zinc-400 px-4 py-2">
          <h5 className="text-xs">Artist Name</h5>
          <h5 className="text-xs">Track</h5>
          <h5 className="text-xs">Vote</h5>
        </div>
        <div>
          <div className="flex justify-between border-zinc-400 px-4 py-4">
            <h5 className="text-sm">Artist Name</h5>
            <iframe
              allow="autoplay"
              src={soundCloudUrl(`https://soundcloud.com/dekafbass/catalyst`)}
              height="20"
            ></iframe>

            <h5 className="text-sm">Vote</h5>
          </div>
          <div className="flex justify-between border-zinc-400 px-4 py-4">
            <h5 className="text-sm">Artist Name</h5>
            <iframe
              allow="autoplay"
              src={soundCloudUrl(`https://soundcloud.com/dekafbass/catalyst`)}
              height="20"
            ></iframe>

            <h5 className="text-sm">Vote</h5>
          </div>
          <div className="flex justify-between border-zinc-400 px-4 py-4">
            <h5 className="text-sm">Artist Name</h5>
            <iframe
              allow="autoplay"
              src={soundCloudUrl(`https://soundcloud.com/dekafbass/catalyst`)}
              height="20"
            ></iframe>

            <h5 className="text-sm">Vote</h5>
          </div>
        </div>
        <div>
          <div>left</div>
        </div>
      </div>
    </div>
  );
}

export default Community;
