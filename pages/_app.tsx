import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

import "antd/dist/antd.css";
import { SWRConfig } from "swr";
import { useIsLoggedIn } from "../lib/api";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

const publicRoutes = ["/login", "/not-us"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useIsLoggedIn();
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !publicRoutes.includes(router.pathname)) {
      router.push("/login");
    }
    // else if (isLoggedIn && publicRoutes.includes(router.pathname)) {
    //   router.push("/");
    // }
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
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
export default MyApp;
