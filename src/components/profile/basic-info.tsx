import { User } from "@prisma/client";
import { Session } from "next-auth";
import { type SessionContextValue } from "next-auth/react";
import React, { useState } from "react";
import { stringify } from "superjson";
import { api } from "~/utils/api";

interface BasicInfoProps {
  user: {
    id: string;
    role: string;
    image: string | null;
    email: string;
    name: string;
  };
}
function BasicInfo({ user }: BasicInfoProps) {
  const [form, setForm] = useState({
    email: "",
    name: "",
  });
  const [formSubmission, setFormSubmission] = useState({
    email: false,
    name: false,
    profilePic: false,
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const file = files[0] as File;
      const data = stringify(file);
      setProfileImage(data);
    }
  };

  const profileImageMutation =
    api.userprofile.updateProfilePicture.useMutation();
  const usernameMutation = api.userprofile.updateProfileUsername.useMutation();
  const emailMutation = api.userprofile.updateProfileEmail.useMutation();

  const handleEmailUpdate = () => {
    if (form.email !== user?.email) {
      emailMutation.mutate({ email: form.email });
    }
    setFormSubmission({ ...formSubmission, email: true });
  };
  const handleUsernameUpdate = () => {
    if (form.name !== user?.name) {
      usernameMutation.mutate({ name: form.name });
    }
    setFormSubmission({ ...formSubmission, name: true });
  };
  const handleProfilePictureUpdate = () => {
    profileImageMutation.mutate({ image: stringify(profileImage) });
    setFormSubmission({ ...formSubmission, profilePic: true });
  };

  return (
    <div>
      <h3>Basic Info</h3>
      <div className="flex justify-between gap-2">
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-row justify-between gap-2">
            {formSubmission.email ? (
              <h5 className="flex w-full justify-end text-yellow-400">
                Submitted, please log back in to see changes.
              </h5>
            ) : (
              <>
                <label htmlFor="email" className="text-sm">
                  Email Address:
                </label>
                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    placeholder={user?.email || ""}
                    onChange={handleForm}
                    className="rounded-lg px-2 text-center text-black"
                  />
                  <button
                    className="px-2 hover:bg-zinc-600"
                    onClick={handleEmailUpdate}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-row justify-between gap-2">
            {formSubmission.name ? (
              <h5 className="flex w-full justify-end text-yellow-400">
                Submitted, please log back in to see changes.
              </h5>
            ) : (
              <>
                <label htmlFor="name" className="text-sm">
                  Display Name:
                </label>
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    placeholder={user?.name || ""}
                    onChange={handleForm}
                    className="rounded-lg px-2 text-center text-black"
                  />
                  <button
                    className="px-2 hover:bg-zinc-600"
                    onClick={handleUsernameUpdate}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            {formSubmission.profilePic ? (
              <h5 className="flex w-full justify-end text-yellow-400">
                Submitted, please log back in to see changes.
              </h5>
            ) : (
              <>
                <div className="flex w-full flex-col">
                  <label
                    htmlFor="profileImg"
                    className="mb-2 block whitespace-nowrap text-sm font-medium text-white"
                  >
                    Upload Profile Picture:
                  </label>
                  <input
                    id="profileImg"
                    name="profileImg"
                    type="file"
                    multiple={false}
                    onChange={(e) => void handleFileInput(e)}
                    accept="image/png, image/jpeg, image/jpg"
                    className="w-full cursor-pointer rounded-lg border border-gray-600 bg-gray-700 text-sm text-gray-400 placeholder-gray-400 focus:outline-none "
                  />
                </div>
                <button
                  className="px-2 hover:bg-zinc-600"
                  onClick={handleProfilePictureUpdate}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicInfo;
