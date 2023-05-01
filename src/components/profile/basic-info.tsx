import type { Session } from "next-auth";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { readFileasBase64 } from "~/utils/readFileAsBase64";

interface BasicInfoProps {
  session: Session;
}

function BasicInfo({ session }: BasicInfoProps) {
  const [form, setForm] = useState({
    email: session.user.email ?? "",
    name: session.user.name || "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const file = files[0] as File;
      const base64 = await readFileasBase64(file);
      setProfileImage(base64);
    }
  };

  const formupdate = api.userprofile.updateProfile.useMutation();
  const profileimageupdate = api.userprofile.updateProfilePicture.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      formupdate.mutate(form);

      if (profileImage) {
        profileimageupdate.mutate({ image: profileImage });
      }
      setUpdated(true);
      // if (form.email === session.user.email && form.name === session.user.name)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Basic Info</h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <label htmlFor="email" className="text-sm">
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            placeholder={session.user.email || ""}
            onChange={handleForm}
            className="rounded-lg px-2 text-center text-black"
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <label htmlFor="name" className="text-sm">
            Display Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            placeholder={session.user.name || ""}
            onChange={handleForm}
            className="rounded-lg px-2 text-center text-black"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="profileImg"
            className="mb-2 block text-sm font-medium text-white"
          >
            Upload Profile Picture
          </label>
          <input
            id="profileImg"
            name="profileImg"
            type="file"
            multiple={false}
            onChange={(e) => void handleFileInput(e)}
            accept="image/*"
            className="block w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none "
          />
        </div>
        {updated ? (
          <div className="w-fit border border-zinc-800 bg-zinc-100 px-4 text-sm text-black">
            PLEASE LOG IN AGAIN TO SEE CHANGES
          </div>
        ) : (
          <button
            type="submit"
            className="mt-4 w-fit rounded-2xl bg-white px-4 py-1 text-black"
          >
            Update
          </button>
        )}
      </div>
    </form>
  );
}

export default BasicInfo;
