import Image from "next/image";
import React from "react";

function UserNav() {
  return (
    <div className="flex items-center rounded-full">
      <p className="mr-[-10%] rounded-lg bg-white px-6 text-black">Username</p>
      <div className="h-12 w-12 rounded-full bg-pink-300">
        <h1 className="flex h-full w-full items-center justify-center ">😛</h1>
        {/* <Image
            src=""
            alt="pfp"
            className="flex h-full w-full items-center justify-center "
          /> */}
      </div>
    </div>
  );
}

export default UserNav;
