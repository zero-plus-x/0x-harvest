import "../styles/globals.css";
import Head from "next/head";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

import "antd/dist/antd.css";

function MyApp({ Component, pageProps }: AppProps) {
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
