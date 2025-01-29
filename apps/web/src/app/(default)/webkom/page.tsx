import Image from "next/image";
import { FaCrown } from "react-icons/fa";

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
      <Heading className="mx-auto font-display">Webkom</Heading>
      {/* Forslag om å opprette gruppe var 28. jul 2020 */}
      {/* Slack ble laget 5. aug 2020 */}
      <Text className="text-xs text-muted-foreground">EST. 2020</Text>

      <Text className="text-muted-foreground">
        Tidligere og nåværende medlemmer av echo Webkom.
      </Text>

      <div className="mx-auto my-10 max-w-md space-y-8">
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem className="relative mx-auto w-fit">
            <FaCrown className="absolute -left-6 top-1 text-yellow-400" />
            <span>Andreas Bakseter (Co-founder)</span>
          </ListItem>
          <ListItem className="relative mx-auto w-fit">
            <FaCrown className="absolute -left-6 top-1 text-yellow-400" />
            <span>Bo Aanes (Co-founder)</span>
          </ListItem>
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
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Jesper Kierulf Hammer</ListItem>
        </UnorderedList>

        {/* --- H24 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Andreas Drevdal</ListItem>
          <ListItem>Birk Monsen</ListItem>
        </UnorderedList>
      </div>
    </Container>
  );
}
