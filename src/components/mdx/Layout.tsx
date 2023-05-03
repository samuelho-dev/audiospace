import { MDXProvider } from "@mdx-js/react";
import Paragraph from "./Paragraph";
import { Heading } from "./Heading";

interface LayoutProps {
  children: React.ReactNode;
}

const components = {
  h1: Heading.H1,
  h2: Heading.H2,
  p: Paragraph,
};
export default function Layout({ children, ...props }: LayoutProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
