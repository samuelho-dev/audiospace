import React from "react";
import { FaTwitterSquare } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { RiDiscordFill } from "react-icons/ri";

function Sidebar() {
  return (
    <div className="fixed right-0 top-1/4 z-40 rounded-l-xl bg-zinc-900 p-2 lg:top-1/2">
      <div className="flex flex-col gap-2">
        <FaTwitterSquare size={30} />
        <AiFillInstagram size={30} />
        <RiDiscordFill size={30} />
      </div>
    </div>
  );
}

export default Sidebar;
