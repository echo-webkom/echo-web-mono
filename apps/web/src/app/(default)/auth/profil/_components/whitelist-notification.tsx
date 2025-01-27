import { Callout } from "@/components/typography/callout";
import { getWhitelistByEmail } from "@/data/whitelist/queries";
import { getUser } from "@/lib/get-user";
import { shortDateNoTime } from "@/utils/date";

export default async function WhitelistNotification() {
  const user = await getUser();

  if (!user?.email) {
    return null;
  }

  const whitelist = await getWhitelistByEmail(user.email);

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
