import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { FAKE_HARVEST_TOKEN } from "../../lib/testUtils";

const isProd = process.env.NODE_ENV === "production";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isProd) {
    const config = {
      maxAge: 60 * 60, // 1 hour
      path: "/",
      httpOnly: true,
      secure: isProd,
    };
    setCookie({ res }, "HARVEST_ACCESS_TOKEN", FAKE_HARVEST_TOKEN, config);
    setCookie({ res }, "HARVEST_ACCOUNT_ID", "testAccount1", config);
  }
  return res.redirect("/");
}
