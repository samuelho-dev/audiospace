import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: any;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <Sidebar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
