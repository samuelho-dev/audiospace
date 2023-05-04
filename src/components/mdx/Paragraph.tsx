import React from "react";

interface HeadingProps {
  children: string;
}

function Paragraph({ children }: HeadingProps) {
  return <p className="text-base text-zinc-200">{children}</p>;
}
export default Paragraph;
