import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import { HARVEST_API_BASE_URL } from "../../../lib/harvestConfig";
import * as Sentry from "@sentry/nextjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async () => {
    const oldUrl = req.url;
    req.url = oldUrl?.replace(/^\/api\/harvest/, "");

    console.log(`Proxy rewrite ${oldUrl} -> ${req.url}`);

    const cookies = nookies.get({ req });

    if (cookies.HARVEST_ACCESS_TOKEN && cookies.HARVEST_ACCOUNT_ID) {
      const resp = await fetch(`${HARVEST_API_BASE_URL}/${req.url}`, {
        method: req.method,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${cookies.HARVEST_ACCESS_TOKEN}`,
          "user-agent": "0x tool (jakub@0x.se)",
          "harvest-account-id": cookies.HARVEST_ACCOUNT_ID,
        },
        body: ["GET", "HEAD"].includes(req.method || "GET")
          ? undefined
          : JSON.stringify(req.body),
      });

      if (resp.headers.get("content-type")?.startsWith("application/json")) {
        const data = await resp.json();

        if (req.url === "/users/me" && data) {
          Sentry.captureMessage(`Loaded page`, { user: { email: data.email } });
        }
        res.status(resp.status).json(data);
      } else {
        const respText = await resp.text();
        res.status(resp.status).json(respText);
      }

      return;
    } else {
      return res.status(401).end();
    }
  });
}

export default Sentry.withSentry(handler);
