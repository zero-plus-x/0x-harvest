import "../styles/globals.css";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import "antd/dist/antd.css";
import React from "react";
import { useRouter } from "next/router";
import CommonLayout from "../components/layout/CommonLayout";
import { useUser } from "../lib/api";

const publicPaths = ["/login"];

function MyApp({ Component, pageProps }: AppProps) {
  const { isError } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isError) {
      const path = router.asPath.split("?")[0];
      if (!publicPaths.includes(path)) {
        console.log("Redirecting to login");
        router.push({
          pathname: "/login",
        });
      }
    }
  }, [isError, router]);

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
        <CommonLayout>
          <Component {...pageProps} />
        </CommonLayout>
      </SWRConfig>
    </>
  );
}
export default MyApp;
