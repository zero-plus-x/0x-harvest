import type { ServerResponse } from "http";

export const cachePage = (res: ServerResponse) => {
  const oneMonth = 30 * 24 * 60 * 60;
  res.setHeader(
    "Cache-Control",
    `public, s-maxage=${oneMonth}, max-age=${oneMonth}`
  );
};
