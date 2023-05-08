import React, { useState } from "react";
import { api } from "~/utils/api";
import { StandardB2Dropzone } from "../dropzone/StandardB2Dropzone";

function BattleAdminPanel() {
  const endAndCreateBattleMutation =
    api.battles.endBattleandCreate.useMutation();
  const [uploadedFile, setuploadedFile] = useState(false);
  const [newBattle, setNewBattle] = useState({
    description: "",
    file: "",
  });
  const handleDescription = (value: string) => {
    setNewBattle((prevData) => ({ ...prevData, description: value }));
  };
  const handleFileChange = (value: string) => {
    setNewBattle((prevData) => ({ ...prevData, file: value }));
  };

  const handleNewBattle = async () => {
    await endAndCreateBattleMutation.mutateAsync({
      description: newBattle.description,
    });
  };
  return (
    <div className="flex flex-col gap-2 rounded-sm bg-zinc-900 p-4">
      <h2>Battle Admin Panel</h2>
      <div className="flex flex-col">
        <label>Description</label>
        <input
          type="text"
          onChange={(e) => handleDescription(e.target.value)}
        />
      </div>
      {uploadedFile ? (
        <h3>Submitted</h3>
      ) : (
        <div className="flex flex-col">
          <label>Sample</label>
          <StandardB2Dropzone
            bucket="battles"
            handleFileChange={handleFileChange}
            setUploadedFile={setuploadedFile}
          />
        </div>
      )}

      <button
        onClick={() => void handleNewBattle()}
        className="border border-zinc-300 px-2"
      >
        End and create
      </button>
    </div>
  );
}

export default BattleAdminPanel;
