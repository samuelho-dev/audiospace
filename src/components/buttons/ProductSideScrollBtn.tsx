import React from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

function ProductSideScrollBtn() {
  return (
    <div className="flex gap-2">
      <button className="flex h-5 w-10 items-center justify-center rounded-md text-center outline outline-1 outline-zinc-500 hover:bg-zinc-800">
        <MdOutlineKeyboardDoubleArrowLeft />
      </button>
      <button className="flex h-5 w-10 items-center justify-center rounded-md text-center outline outline-1 outline-zinc-500 hover:bg-zinc-800">
        <MdOutlineKeyboardDoubleArrowRight />
      </button>
    </div>
  );
}

export default ProductSideScrollBtn;
