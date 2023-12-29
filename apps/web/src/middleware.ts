import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(25, "10 s"),
  redis: kv,
});

export const config = {
  matcher: "/((?!api|_next|static|public|favicon.ico).*)",
};

const IGNORED_PATHNAMES = ["/arrangement", "/bedpres"];

const shouldIngnore = (pathname: string) =>
  IGNORED_PATHNAMES.some((ignoredPathname) => pathname.startsWith(ignoredPathname));

let middleware;

if (process.env.VERCEL_ENV === "production") {
  middleware = async (request: NextRequest) => {
    const ip = request.ip ?? "127.0.0.1";

    if (request.method === "POST" || !shouldIngnore(request.nextUrl.pathname)) {
      const { success, limit, remaining } = await ratelimit.limit(ip);

      request.headers.set("x-ratelimit-limit", limit.toString());
      request.headers.set("x-ratelimit-remaining", remaining.toString());

      return success
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/rate-limited", request.url));
    }

    return NextResponse.next();
  };
} else {
  middleware = () => {
    return NextResponse.next();
  };
}

export default middleware;
