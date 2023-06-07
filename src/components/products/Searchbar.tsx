import React from "react";
import { BiSearchAlt } from "react-icons/Bi";

function Searchbar() {
  return (
    <div className="flex w-full justify-center gap-2 pt-10">
      <input
        type="text"
        className="h-6 w-1/2 rounded-lg bg-zinc-200 p-2 text-black"
      ></input>
      <div>
        <BiSearchAlt size={25} />
      </div>
    </div>
  );
}

export default Searchbar;
