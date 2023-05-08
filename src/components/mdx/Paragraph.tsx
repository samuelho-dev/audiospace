import { type ReactNode } from "@mdx-js/react/lib";
import React from "react";

interface HeadingProps {
  children?: ReactNode;
}

function Paragraph({ children }: HeadingProps) {
  return <p className="text-base text-zinc-200">{children}</p>;
}
export default Paragraph;
