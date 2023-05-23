import React, { useState } from "react";
import { api } from "~/utils/api";
import { StandardB2Dropzone } from "../dropzone/StandardB2Dropzone";
import axios from "axios";

function BattleAdminPanel() {
  const endAndCreateBattleMutation =
    api.battles.endBattleandCreate.useMutation();

  const [submitted, setSubmitted] = useState(false);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [presignUrl, setPresignUrl] = useState<string | null>("");
  const [newBattle, setNewBattle] = useState({
    description: "",
    file: "",
  });
  const handleDescription = (value: string) => {
    setNewBattle({ ...newBattle, description: value });
  };
  const handleFileChange = (value: string, key: string) => {
    setNewBattle({ ...newBattle, [key]: value });
  };

  const handleNewBattle = async () => {
    try {
      if (presignUrl && sampleFile) {
        await axios({
          method: "put",
          url: presignUrl,
          data: sampleFile,
          headers: {
            "Content-Type": sampleFile.type,
          },
        });
      }
      await endAndCreateBattleMutation.mutateAsync({
        description: newBattle.description,
        sample: newBattle.file.length === 0 ? undefined : newBattle.file,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error with starting battle", err);
    }
  };
  return (
    <div className="flex flex-col gap-2 rounded-sm bg-zinc-900 p-4">
      <h2>Battle Admin Panel</h2>
      {submitted ? (
        <div>Submitted</div>
      ) : (
        <div>
          <div className="flex flex-col">
            <label>Description</label>
            <input
              type="text"
              className="px-5 text-black"
              onChange={(e) => handleDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Sample</label>
            <StandardB2Dropzone
              bucket="AudiospaceSamples"
              field="file"
              handleFileChange={handleFileChange}
              setPresignedUrl={setPresignUrl}
              setProductDownloadFile={setSampleFile}
            />
          </div>

          <button
            onClick={() => void handleNewBattle()}
            className="border border-zinc-300 px-2"
          >
            End and create
          </button>
        </div>
      )}
    </div>
  );
}

export default BattleAdminPanel;
