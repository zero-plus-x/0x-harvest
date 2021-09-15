import { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Logging out");
  destroyCookie({ res }, "HARVEST_ACCESS_TOKEN", { path: "/" });
  destroyCookie({ res }, "HARVEST_ACCOUNT_ID", { path: "/" });
  res.status(200).end();
}
