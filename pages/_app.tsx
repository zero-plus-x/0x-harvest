import "../styles/globals.css";
import { Spin } from "antd";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import { useIsLoggedIn } from "../lib/api";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import "antd/dist/antd.css";
import CommonLayout from "../components/layout/CommonLayout";

const publicRoutes = ["/login", "/not-us"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !publicRoutes.includes(router.pathname)) {
      router.push("/login");
    } else if (isLoggedIn && publicRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [router, isLoggedIn, isLoading]);

  return (
    <>
      <Head>
        <title>0+x Harvest</title>
      </Head>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        {isLoading || (!isLoggedIn && router.pathname !== "/login") ? (
          <CommonLayout>
            <Spin />
          </CommonLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </SWRConfig>
    </>
  );
}
export default MyApp;
