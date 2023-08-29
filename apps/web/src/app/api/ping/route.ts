import { NextResponse } from "next/server";

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);
  const paramsCount = searchParams.get("count");
  const count = paramsCount ? parseInt(paramsCount, 10) : 1;

  return NextResponse.json({
    message: Array(count).fill("pong"),
  });
};
