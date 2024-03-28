import { unbanUser } from "@/actions/strikes";
import { getBannedUsers } from "@/data/users/queries";
import { isReadyToUnban } from "@/lib/ban-info";
import { withBasicAuth } from "@/lib/checks/with-basic-auth";

export const POST = withBasicAuth(async () => {
  try {
    const users = await getBannedUsers();

    for (const user of users) {
      if (await isReadyToUnban(user)) {
        await unbanUser(user.id);
      }
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    if (error instanceof TypeError) {
      return new Response("Bad request", { status: 400 });
    }

    return new Response("Internal server error", { status: 500 });
  }
});
