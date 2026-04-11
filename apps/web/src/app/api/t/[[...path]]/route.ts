import { type NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;

  if (!umamiUrl) {
    return NextResponse.json({ error: "Umami not configured" }, { status: 503 });
  }

  const url = new URL(req.nextUrl.pathname.replace("/api/t", "/api"), umamiUrl);
  url.search = req.nextUrl.search;

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      "User-Agent": req.headers.get("user-agent") ?? "",
      "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "",
    },
    body: req.method === "GET" ? undefined : req.body,
    // @ts-expect-error - required for streaming request bodies in Node.js
    duplex: "half",
  });

  return new Response(res.body, { status: res.status });
};

export const GET = handler;
export const POST = handler;
