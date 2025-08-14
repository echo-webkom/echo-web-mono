import { baseMessages } from "@/lib/random-message";

export function GET() {
  return Response.json(baseMessages);
}
