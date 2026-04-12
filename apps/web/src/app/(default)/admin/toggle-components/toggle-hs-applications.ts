"use server";

import { revalidatePath } from "next/cache";

import { featureFlags } from "../../../../data/kv/namespaces";

export default async function toggleHsApplications(newValue: boolean) {
  console.info("Setting HS-Applications to:", newValue);
  await featureFlags.set("HS-Application", { showHSApplications: newValue });

  const check = await featureFlags.get("HS-Application");
  console.info("Changed to", check);
  revalidatePath("/admin");
  revalidatePath("/hjem");
}
