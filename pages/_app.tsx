import "../styles/globals.css";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import "antd/dist/antd.css";
import React from "react";
import { Router } from "next/router";
import { Spin } from "antd";
import CommonLayout from "../components/layout/CommonLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("findished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

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
          {loading ? <Spin /> : <Component {...pageProps} />}
        </CommonLayout>
      </SWRConfig>
    </>
  );
}
export default MyApp;
