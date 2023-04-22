import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

function StartBattle() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    banner: "",
    file: "",
  });

  if (status === "unauthenticated") {
    void router.push("/auth/signin");
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (file instanceof File) {
        const base64Files = await readFileasBase64(file);
        setForm((prevData) => ({ ...prevData, file: base64Files }));
      }
    }
  };

  const handleSubmit = () => {};

  if (status === "authenticated") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <h2>Start a battle</h2>
        <div className="flex flex-col gap-2 py-4">
          <div className="flex w-full justify-between">
            <label>Title:</label>
            <input type="text" />
          </div>
          <div className="flex w-full justify-between">
            <label>Description:</label>
            <input type="text" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Upload Banner
            </label>
            <input
              id="profileImg"
              name="profileImg"
              type="file"
              onChange={(e) => void handleFileChange(e)}
              accept="mp3/*, wav/*"
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Upload Sample
            </label>
            <input
              id="profileImg"
              name="profileImg"
              type="file"
              onChange={(e) => void handleFileChange(e)}
              accept="mp3/*, wav/*"
              className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none"
            />
          </div>
          <button>Submit</button>
        </div>
      </form>
    );
  }
}

export default StartBattle;
