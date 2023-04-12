import React, { useState } from "react";

interface FilterBtnProps {
  children: React.ReactNode;
}

function FilterBtn({ children }: FilterBtnProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer rounded-lg px-2 py-1 text-xs outline outline-1 outline-zinc-400  ${
        clicked ? "bg-zinc-600 hover:bg-zinc-500" : "bg-none hover:bg-zinc-700"
      }`}
    >
      {children}
    </div>
  );
}

export default FilterBtn;
