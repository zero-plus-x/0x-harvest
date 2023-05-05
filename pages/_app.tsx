import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/reset.css";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import CommonLayout from "../components/layout/CommonLayout";
import {
  UserSettingsStore,
  UserSettingsStoreContext,
} from "../stores/UserSettingsStore";
import { useUser } from "../lib/api";

const publicPaths = ["/login", "/not-us"];

function App({ Component, pageProps }: AppProps) {
  const { isError } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  React.useEffect(() => {
    if (isError) {
      if (pathname && !publicPaths.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [isError, router]);

  return (
    <>
      <Head>
        <title>0+x Harvest</title>
        <meta
          name="viewport"
          content="initial-scale=1, maximum-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#001529" />
      </Head>
      <UserSettingsStoreContext.Provider value={new UserSettingsStore()}>
        <CommonLayout>
          <Component {...pageProps} />
        </CommonLayout>
      </UserSettingsStoreContext.Provider>
    </>
  );
}
export default App;
