import { Spin } from "antd";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";
import nookies from "nookies";
import { ReactNode, useEffect } from "react";
import CommonLayout from "../components/layout/CommonLayout";

export async function getServerSideProps(context: NextPageContext) {
  const cookies = nookies.get(context);
  return {
    props: {
      isLoggedIn:
        cookies.HARVEST_ACCESS_TOKEN && cookies.HARVEST_ACCOUNT_ID
          ? true
          : false,
    },
  };
}

const OAuth2: NextPage = (props: {
  isLoggedIn?: boolean;
  children?: ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (props.isLoggedIn) {
      router.push("/");
    } else {
      window.location.replace("/api/oauth2");
    }
  }, [router, props.isLoggedIn]);

  return (
    <CommonLayout>
      <Spin />{" "}
    </CommonLayout>
  );
};

export default OAuth2;
