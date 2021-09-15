import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import httpProxy from "http-proxy";
import { HARVEST_API_BASE_URL } from "../../../lib/harvestConfig";

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((_resolve, reject) => {
    req.url = (req.url || "").replace(/^\/api\/harvest/, "");

    const cookies = nookies.get({ req });

    if (cookies.HARVEST_ACCESS_TOKEN && cookies.HARVEST_ACCOUNT_ID) {
      req.headers["Authorization"] = `Bearer ${cookies.HARVEST_ACCESS_TOKEN}`;
      req.headers["Harvest-Account-Id"] = cookies.HARVEST_ACCOUNT_ID;
    } else {
      return res.status(401).end();
    }
    req.headers["User-Agent"] = "0x tool (jakub@0x.se)";
    proxy.once("error", reject);
    // Forward the request to the API
    proxy.web(req, res, {
      target: HARVEST_API_BASE_URL,
      // Don't autoRewrite because we manually rewrite the URL in the route handler.
      autoRewrite: false,
      changeOrigin: true,
    });
  });
}
