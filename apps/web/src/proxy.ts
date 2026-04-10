import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ENVIRONMENT } from "./config";

export function proxy(request: NextRequest) {
  if (ENVIRONMENT !== "production") {
    // We don't really care about this type of logging in development.
    return NextResponse.next();
  }

  if (request.headers.get("next-router-prefetch") === "1") {
    // Skip logging for prefetch requests to reduce noise.
    return NextResponse.next();
  }

  const start = Date.now();
  const response = NextResponse.next();

  response.headers.set("x-request-start", String(start));

  const ip =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  // oxlint-disable-next-line no-console
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.nextUrl.pathname,
      query: request.nextUrl.search,
      user_agent: request.headers.get("user-agent"),
      ip: ip,
      duration: Date.now() - start, // approximate — response isn't awaited here
    }),
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
