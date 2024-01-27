import Link from "next/link";

import { auth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Content } from "./content";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <p className="text-center">GRATULERE BEDKOM {"<3"}</p>
    </>
  );
}
