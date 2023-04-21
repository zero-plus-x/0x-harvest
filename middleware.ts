import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Route } from "./lib/routes";

export function middleware(request: NextRequest) {
  const harvestToken = request.cookies.get("HARVEST_ACCESS_TOKEN");

  if (!request.nextUrl.pathname.startsWith(Route.LOGIN) && !harvestToken) {
    return NextResponse.redirect(new URL(Route.LOGIN, request.url));
  }
}

export const config = {
  matcher: [Route.HOME, Route.SETTINGS, Route.VACATION, Route.ADMIN],
};
