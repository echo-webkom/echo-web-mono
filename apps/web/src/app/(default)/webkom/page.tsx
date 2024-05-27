import Image from "next/image";

import Webkom from "@/assets/images/webkom.png";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";

export default function WebkomPage() {
  return (
    <Container className="py-10 text-center">
      <Image className="mx-auto h-32 w-auto" src={Webkom} alt="Webkom logo" />
      <Heading className="font-display">Webkom</Heading>
      {/* Slack ble laget 5. aug 2020 */}
      <Text className="text-xs text-muted-foreground">EST. 2020</Text>

      <Text className="text-muted-foreground">
        Tidligere og nåværende medlemmer av echo Webkom.
      </Text>

      <div className="mx-auto my-10 max-w-md space-y-8">
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Andreas Bakseter (Co-founder)</ListItem>
          <ListItem>Bo Aanes (Co-founder)</ListItem>
        </UnorderedList>

        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Alvar Hønsi</ListItem>
          <ListItem>Øyvind Grutle</ListItem>
          <ListItem>Sander Sigmundstad</ListItem>
          <ListItem>Victoria Valner</ListItem>
        </UnorderedList>

        {/* --- H21 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Nikolaus Engh</ListItem>
          <ListItem>Ole Magnus Fon Johnsen</ListItem>
          <ListItem>Mathilde Bergenheim</ListItem>
          <ListItem>Thea Jenny Kolnes</ListItem>
          <ListItem>Felix Kaasa</ListItem>
        </UnorderedList>

        {/* --- H22 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Torger Bocianowski</ListItem>
          <ListItem>Malin Torset Sivertstøl</ListItem>
          <ListItem>Karolina Gil</ListItem>
          <ListItem>Leoul Zinaye Tefera</ListItem>
          <ListItem>Kjetil Alvestad</ListItem>
          <ListItem>Jonas Hammerseth</ListItem>
        </UnorderedList>

        {/* --- H23 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Johanne Blikberg Herheim</ListItem>
          <ListItem>Kristian Elde Johansen</ListItem>
          <ListItem>Swarnika Sellathurai</ListItem>
          <ListItem>Zeno Elio Leonardi</ListItem>
          <ListItem>Izaak Sarnecki</ListItem>
          <ListItem>Wengeal Abebe</ListItem>
          <ListItem>Hermann Holstad Walaunet</ListItem>
        </UnorderedList>

        {/* --- V24 --- */}

        {/* --- H24 --- */}
      </div>
    </Container>
  );
}
