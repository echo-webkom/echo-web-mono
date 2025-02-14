import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";
import { ensureBedkom } from "@/lib/ensure";

export default async function StrikesPage() {
  await ensureBedkom();

  return (
    <Container>
      <Heading>Prikker</Heading>

      <Text>Velkommen til prikke-dashboardet.</Text>

      <Heading className="mb-4" level={2}>
        Regler
      </Heading>

      <UnorderedList>
        <ListItem>Du kan gi 1 - 4 prikker på en gang</ListItem>
        <ListItem>På prikk nr. 4 blir en bruker banned</ListItem>
        <ListItem>Prikker varer i 10 måneder</ListItem>
        <ListItem>En ban varer i 2 måneder</ListItem>
      </UnorderedList>
    </Container>
  );
}
