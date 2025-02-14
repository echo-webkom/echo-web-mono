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
        <ListItem>Du kan gi 1 - 5 prikker på en gang</ListItem>
        <ListItem>Prikker varer i 10 måneder</ListItem>
        <ListItem>Om en bruker får 5 eller flere prikker blir de banned</ListItem>
        <ListItem>En ban varer i 3 måneder</ListItem>
        <ListItem>Prikker og bans utløper ved midnatt</ListItem>
      </UnorderedList>
    </Container>
  );
}
