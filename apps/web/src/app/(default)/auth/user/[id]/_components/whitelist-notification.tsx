import { auth } from "@/auth/session";
import { Callout } from "@/components/typography/callout";
import { shortDateNoTime } from "@/utils/date";
import { unoWithAdmin } from "../../../../../../api/server";

export default async function WhitelistNotification() {
  const user = await auth();

  if (!user?.email) {
    return null;
  }

  const whitelist = await unoWithAdmin.whitelist.getByEmail(user.email);

  if (!whitelist) {
    return null;
  }

  return (
    <Callout type="warning">
      <h1 className="mb-2 ml-3 font-semibold">Du har midlertidlig tilgang til echo sine sider. </h1>
      <h2 className="ml-3">
        Du vil miste tilgang <b>{shortDateNoTime(whitelist.expiresAt)}</b>
      </h2>
    </Callout>
  );
}
