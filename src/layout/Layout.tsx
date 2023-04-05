import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { api } from "~/utils/api";

interface LayoutProps {
  children: any;
}

function Layout({ children }: LayoutProps) {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
