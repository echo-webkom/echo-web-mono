import { redirect } from "next/navigation";

import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";

export default async function UserHappenings() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  return (
    <div>
      <Heading level={2} className="mb-4">
        Dine troféer
      </Heading>
    </div>
  );
}
