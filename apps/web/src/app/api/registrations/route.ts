import { getHappeningCsvData } from "@/data/happenings/queries";
import { toCsv } from "@/lib/csv";
import { createAuthedRoute } from "@/lib/factories/route";
import { isHost } from "@/lib/memberships";
import { slugify } from "@/utils/slugify";

export const dynamic = "force-dynamic";

export const GET = createAuthedRoute(async (req, _ctx, { user }) => {
  const happeningId = req.nextUrl.searchParams.get("happeningId");
  if (!happeningId) {
    return new Response("Missing happeningId", { status: 400 });
  }

  const happening = await getHappeningCsvData(happeningId);

  if (!happening) {
    return new Response("Happening not found", { status: 404 });
  }

  if (!isHost(user, happening)) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(toCsv(happening), {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename=${slugify(happening.title)}-registrations.csv`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
});
