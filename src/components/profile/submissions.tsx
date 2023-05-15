import React from "react";
import { api } from "~/utils/api";
import soundCloudUrl from "~/utils/soundcloudUrl";

function Submissions() {
  const submissionQuery = api.user.getPastBeatSubmissions.useQuery();

  console.log(submissionQuery.data);
  return (
    <div>
      <h2>Submissions</h2>
      <div className="h-40">
        {submissionQuery.data &&
          submissionQuery.data.map((submission) => (
            <div key={submission.id} className="flex justify-between">
              {/* <p>{submission.subimittedAt.toLocaleString()}</p> */}
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
