import { NextPageContext } from "next";
import nookies from "nookies";

export const requireAuth = (context: NextPageContext) => {
  const cookies = nookies.get(context);

  if (!cookies.HARVEST_ACCESS_TOKEN) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export const forbidAuth = (context: NextPageContext) => {
  const cookies = nookies.get(context);

  if (cookies.HARVEST_ACCESS_TOKEN) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
