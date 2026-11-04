import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { ensureBedkom } from "@/lib/ensure";

import { StrikesList } from "../brukere/_components/strikes-list";
import { NewStrikesForm } from "../ny/_components/new-strikes-form";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserStrikesPage({ params }: Props) {
  await ensureBedkom();

  const { userId } = await params;
  const user = await unoWithAdmin.users.strikeDetailsByUserId(userId);

  const formUser = {
    id: user.id,
    name: user.name ?? "",
    hasImage: user.hasImage,
    isBanned: user.banInfo !== null,
    strikes: user.dots.reduce((sum, dot) => sum + dot.count, 0),
  };

  return (
    <Container>
      <Heading className="mb-8">Prikker for {user.name}</Heading>
      {user.dots.length === 0 && user.banInfo === null ? (
        <p className="text-muted-foreground">{user.name} har ingen prikker eller ban.</p>
      ) : (
        <StrikesList users={[user]} />
      )}
      <div className="mt-10">
        <Heading className="mb-8">Legg til prikker</Heading>

        <NewStrikesForm users={[formUser]} initialUserId={user.id} />
      </div>
    </Container>
  );
}
