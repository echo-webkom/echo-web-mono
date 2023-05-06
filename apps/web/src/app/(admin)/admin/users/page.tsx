import {getAllUsers} from "@echo-webkom/db/queries/user";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";

export default async function FeedbackOverview() {
  const users = await getAllUsers();

  return (
    <Container>
      <Heading>Tilbakemeldinger</Heading>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <li key={user.id} className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">E-post: {user.email}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Alternativ e-post: {user.alternativeEmail ?? "Ikke satt"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Studieprogram: {user.degree ?? "Ikke satt"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Årstrinn: {user.year ?? "Ikke satt"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Rolle: {user.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
