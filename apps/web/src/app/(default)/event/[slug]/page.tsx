import { notFound, redirect } from "next/navigation";

import { getHappeningTypeBySlug } from "@/sanity/happening";

type Props = {
  params: {
    slug: string;
  };
};

export default async function EventRedirect({ params }: Props) {
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
