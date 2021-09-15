import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  if (query.access_token) {
    const accountResponse = await fetch(
      "https://id.getharvest.com/api/v2/accounts",
      {
        headers: {
          Authorization: `Bearer ${query.access_token}`,
          "User-Agent": "0x tool (jakub@0x.se)",
        },
      }
    );
    const accounts: { accounts: { id: number; name: string }[] } =
      await accountResponse.json();
    const hyperOneAccount = accounts.accounts.find(
      (a) => a.name === "Hyper One"
    );
    if (hyperOneAccount && typeof query.access_token === "string") {
      const config = {
        maxAge: query.expires_in,
        path: "/",
        httpOnly: true,
        // sameSite: true,
        // secure: true,
      };
      setCookie({ res }, "HARVEST_ACCESS_TOKEN", query.access_token, config);
      setCookie({ res }, "HARVEST_ACCOUNT_ID", hyperOneAccount.id + "", config);

      return res.redirect("/");
    }
  }

  return res.redirect("/not-us");
}
