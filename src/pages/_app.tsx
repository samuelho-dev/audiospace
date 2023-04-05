import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import Layout from "~/layout/Layout";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{
  session: Session | null;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>audiospace</title>
        <meta name="description" content="where producers gear up" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex min-h-screen 
        flex-col items-center justify-between bg-gradient-to-b from-[#191919] to-[#000000] py-4"
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
