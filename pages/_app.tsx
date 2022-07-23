import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import React from "react";
import { useRouter } from "next/router";
import CommonLayout from "../components/layout/CommonLayout";
import { useUser } from "../lib/api";

const publicPaths = ["/login"];

function App({ Component, pageProps }: AppProps) {
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#001529" />
      </Head>

      <CommonLayout>
        <Component {...pageProps} />
      </CommonLayout>
    </>
  );
}
export default App;
