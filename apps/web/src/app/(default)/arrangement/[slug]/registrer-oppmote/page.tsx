import { db } from "@echo-webkom/db/serverless";
import { notFound } from "next/navigation";

import { RegisterAttendance } from "./_components/register-attendance";

type Props = {
  params: Promise<{ slug: string }>;
};

export const metadata = {
  title: "Registrer oppmøte",
};

export default async function RegisterOwnAttendancePage({ params }: Props) {
  const { slug } = await params;
  const happening = await db.query.happenings.findFirst({
    columns: { title: true },
    where: (happening, { eq }) => eq(happening.slug, slug),
  });

  if (!happening) {
    notFound();
  }

  return <RegisterAttendance key={slug} slug={slug} title={happening.title} />;
}