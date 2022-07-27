import type { ServerResponse } from "http";
import { NextApiResponse } from "next";

export const cachePage = (res: ServerResponse) => {
  const oneMonth = 30 * 24 * 60 * 60;
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${oneMonth}, max-age=${oneMonth}`
  );
};

export const cacheApiResponse = (
  res: NextApiResponse,
  seconds: number = 60 * 60 // 1 hour
) => {
  res.setHeader("Cache-Control", `private, max-age=${seconds}`);
};
