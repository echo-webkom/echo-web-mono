import { NextResponse, type NextRequest } from "next/server";
import kv from "@vercel/kv";
import { z } from "zod";

import { client } from "@/sanity/client";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("query");
  const params = request.nextUrl.searchParams.get("params");

  if (!query || !params) {
    return new Response("Missing query or params", { status: 400 });
  }

  let parsedParams: Record<string, unknown>;
  try {
    parsedParams = z.record(z.string(), z.unknown()).parse(JSON.parse(params));
  } catch (error) {
    // Bad JSON probably

    return new Response("Invalid params", { status: 400 });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Query ${query} with params ${JSON.stringify(parsedParams)} at ${new Date().toISOString()}`,
  );

  let response: unknown;
  try {
    response = await client.fetch(query, parsedParams);
  } catch (error) {
    // Bad GROQ probably

    return new Response("Internal error", { status: 500 });
  }

  if (process.env.VERCEL_ENV === "production") {
    await kv.append("queries", JSON.stringify({ query, params: parsedParams, date: new Date() }));
  }

  return NextResponse.json(response);
};
