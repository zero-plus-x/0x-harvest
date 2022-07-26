import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const harvestToken = request.cookies.get("HARVEST_ACCESS_TOKEN");

  if (request.nextUrl.pathname.startsWith("/login") && harvestToken) {
    console.log("a");
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!request.nextUrl.pathname.startsWith("/login") && !harvestToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/login", "/", "/settings", "/vacation"],
};
