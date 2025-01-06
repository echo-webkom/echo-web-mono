import { notFound, redirect } from "next/navigation";

import { getHappeningTypeBySlug } from "@/sanity/happening";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventRedirect(props: Props) {
  const params = await props.params;
  const { slug } = params;

  const type = await getHappeningTypeBySlug(slug);

  if (!type) return notFound();

  if (["event", "external"].includes(type)) {
    return redirect(`/arrangement/${slug}`);
  }

  if (type === "bedpres") {
    return redirect(`/bedpres/${slug}`);
  }

  return notFound();
}
