import React from "react";

interface FilterBtnProps {
  children: React.ReactNode;
  active: boolean;
}

function FilterBtn({ children, active }: FilterBtnProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg px-2 py-1 text-xs outline outline-1 outline-zinc-400  ${
        active ? "bg-zinc-600 hover:bg-zinc-500" : "bg-none hover:bg-zinc-700"
      }`}
    >
      {children}
    </div>
  );
}

export default FilterBtn;
