import { type NextPage } from "next";
import Head from "next/head";

import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>audiospace</title>
        <meta name="description" content="where producers gear up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen 
        flex-col items-center justify-between bg-gradient-to-b from-[#191919] to-[#000000] py-4"
      >
        <Navbar />

        <Footer />
      </main>
    </>
  );
};

export default Home;
