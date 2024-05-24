import Image from "next/image";

import Webkom from "@/assets/images/webkom.png";
import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";
import { UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";

export default function WebkomPage() {
  return (
    <Container className="py-10 text-center">
      <Image className="mx-auto h-32 w-auto" src={Webkom} alt="Webkom logo" />
      <Heading className="font-display">Webkom</Heading>

      <Text className="text-muted-foreground">
        Tidligere og nåværende medlemmer av echo Webkom.
      </Text>

      <Text className="text-sm italic text-muted-foreground">EST. 2020</Text>

      <div className="mx-auto my-10 max-w-md">
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Andreas Bakseter (Co-founder)</ListItem>
          <ListItem>Bo Aanes (Co-founder)</ListItem>

          <hr className="my-4" />

          <ListItem>Alvar Hønsi</ListItem>
          <ListItem>Øyvind Grutle</ListItem>
          <ListItem>Sander Sigmundstad</ListItem>
          <ListItem>Victoria Valner</ListItem>

          {/* --- H21 --- */}
          <ListItem>Nikolaus Engh</ListItem>
          <ListItem>Ole Magnus Fon Johnsen</ListItem>
          <ListItem>Mathilde Bergenheim</ListItem>
          <ListItem>Thea Jenny Kolnes</ListItem>
          <ListItem>Felix Kaasa</ListItem>

          {/* --- H22 --- */}
          <ListItem>Torger Bocianowski</ListItem>
          <ListItem>Malin Torset Sivertstøl</ListItem>
          <ListItem>Karolina Gil</ListItem>
          <ListItem>Leoul Zinaye Tefera</ListItem>
          <ListItem>Kjetil Alvestad</ListItem>
          <ListItem>Jonas Hammerseth</ListItem>

          {/* --- H23 --- */}
          <ListItem>Johanne Blikberg Herheim</ListItem>
          <ListItem>Kristian Elde Johansen</ListItem>
          <ListItem>Swarnika Sellathurai</ListItem>
          <ListItem>Zeno Elio Leonardi</ListItem>
          <ListItem>Izaak Sarnecki</ListItem>
          <ListItem>Wengeal Abebe</ListItem>
          <ListItem>Hermann Holstad Walaunet</ListItem>

          {/* --- V24 --- */}
        </UnorderedList>
      </div>
    </Container>
  );
}
