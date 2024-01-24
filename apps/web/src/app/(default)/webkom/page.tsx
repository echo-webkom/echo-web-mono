import Image from "next/image";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";

export default function WebkomPage() {
  return (
    <Container className="text-center">
      <Image
        className="mx-auto"
        src="/images/webkom.png"
        width={200}
        height={200}
        alt="Webkom logo"
      />
      <Heading className="font-display">Webkom</Heading>

      <Text className="text-gray-800">Tidligere og nåværende medlemmer av echo Webkom.</Text>

      <div className="mx-auto my-10 max-w-md">
        <UnorderedList className="list-none text-lg">
          <ListItem>Andreas Bakseter (Co-founder)</ListItem>
          <ListItem>Bo Aanes (Co-founder)</ListItem>

          <hr className="my-4" />

          <ListItem>Alvar Hønsi</ListItem>
          <ListItem>Øyvind Grutle</ListItem>
          <ListItem>Sander Sigmundstad</ListItem>
          <ListItem>Victoria Valner</ListItem>
          <ListItem>Nikolaus Engh</ListItem>
          {/* --- */}
          <ListItem>Ole Magnus Fon Johnsen</ListItem>
          <ListItem>Mathilde Bergenheim</ListItem>
          <ListItem>Thea Jenny Kolnes</ListItem>
          <ListItem>Felix Kaasa</ListItem>
          {/* --- */}
          <ListItem>Torger Bocianowski</ListItem>
          <ListItem>Malin Torset Sivertstøl</ListItem>
          <ListItem>Karolina Gil</ListItem>
          <ListItem>Leoul Zinaye Tefera</ListItem>
          <ListItem>Kjetil Alvestad</ListItem>
          <ListItem>Jonas Hammerseth</ListItem>
          {/* --- */}
          <ListItem>Johanne Blikberg Herheim</ListItem>
          <ListItem>Kristian Elde Johansen</ListItem>
          <ListItem>Swarnika Sellathurai</ListItem>
          <ListItem>Zeno Elio Leonardi</ListItem>
          <ListItem>Izaak Sarnecki</ListItem>
          <ListItem>Wengeal Abebe</ListItem>
          <ListItem>Hermann Holstad Walaunet</ListItem>
        </UnorderedList>
      </div>
    </Container>
  );
}
