import { MDXProvider } from "@mdx-js/react";
import Paragraph from "./Paragraph";
import { Heading } from "./Heading";
import { type ReactNode } from "@mdx-js/react/lib";

interface LayoutProps {
  children: ReactNode;
}

const components = {
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3,
  p: Paragraph,
};
export default function Layout({ children }: LayoutProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
