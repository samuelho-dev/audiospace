import React, { type DetailedHTMLProps, type HTMLAttributes } from "react";

interface HeadingProps {
  children: string;
}

export const Heading = {
  H1: ({ children }: HeadingProps) => (
    <h1 className="my-4 border border-zinc-700 p-2 text-2xl font-bold">
      {children}
    </h1>
  ),
  H2: ({ children }: HeadingProps) => (
    <h2 className="text-xl font-bold underline underline-offset-4 ">
      {children}
    </h2>
  ),
  H3: ({ children }: HeadingProps) => (
    <h3 className="text-xl font-bold underline underline-offset-4 ">
      {children}
    </h3>
  ),
};
