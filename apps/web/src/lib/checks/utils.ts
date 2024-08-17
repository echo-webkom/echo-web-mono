import { type NextRequest, type NextResponse } from "next/server";

export type Promiseable<T> = T | Promise<T>;
export type HandlerFunction = (request: NextRequest) => Promiseable<Response>;
export type TRequest = Request | NextRequest;
export type TResponse = Response | NextResponse;
