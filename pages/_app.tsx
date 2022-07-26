import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import React from "react";
import CommonLayout from "../components/layout/CommonLayout";
import {
  UserSettingsStore,
  UserSettingsStoreContext,
} from "../stores/UserSettingsStore";

function App({ Component, pageProps }: AppProps) {
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
