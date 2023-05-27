import React from "react";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

function Submissions() {
  const submissionQuery = api.user.getPastBeatSubmissions.useQuery();

  console.log(submissionQuery.data);
  return (
    <div>
      <h2 className="py-4">SUBMISSIONS</h2>
      <div className="flex flex-col gap-4 p-2">
        {submissionQuery.data &&
          submissionQuery.data.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between"
            >
              <p>{submission.submittedAt.toLocaleDateString()}</p>
              <iframe
                allow="autoplay"
                src={soundCloudUrl(submission.trackUrl)}
                height="20"
              ></iframe>
              <p>Rating : {submission.rating}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Submissions;
