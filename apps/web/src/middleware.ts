import {NextResponse, type NextFetchEvent, type NextRequest} from "next/server";

import {ratelimit} from "./lib/rate-limit";

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  const limit = await ratelimit.limit(`ratelimit_middleware_${ip}`);
  event.waitUntil(limit.pending);

  const res = limit.success
    ? NextResponse.next()
    : NextResponse.json({error: "Rate limit exceeded"}, {status: 429});

  res.headers.set("X-RateLimit-Limit", limit.limit.toString());
  res.headers.set("X-RateLimit-Remaining", limit.remaining.toString());
  res.headers.set("X-RateLimit-Reset", limit.reset.toString());

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
