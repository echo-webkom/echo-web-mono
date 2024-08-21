import { unbanUser } from "@/data/users/mutations";
import { getBannedUsers } from "@/data/users/queries";
import { isReadyToUnban } from "@/lib/ban-info";
import { withBearerAuth } from "@/lib/checks/with-bearer-auth";

export const POST = withBearerAuth(async () => {
  try {
    const users = await getBannedUsers();
    const usersToBan = await Promise.all(users.filter((user) => isReadyToUnban(user)));
    await Promise.all(usersToBan.map((user) => unbanUser(user.id)));

    console.info(`Unbanned ${usersToBan.length} users`);

    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof TypeError) {
      return new Response("Bad request", { status: 400 });
    }

    return new Response("Internal server error", { status: 500 });
  }
});
