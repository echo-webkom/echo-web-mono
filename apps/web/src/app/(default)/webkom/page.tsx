import Image from "next/image";
import { FaCrown } from "react-icons/fa";

import Webkom from "@/assets/images/webkom.png";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { UnorderedList } from "@/components/typography/list";
import { ListItem } from "@/components/typography/list-item";
import { Text } from "@/components/typography/text";
import Andreas from "./god-1.png";
import Bo from "./god-2.png";

export default function WebkomPage() {
  return (
    <Container className="py-10 text-center">
      {/* Logo laget av tidligere medlem Alvar Hønsi */}
      <Image className="mx-auto h-32 w-auto" src={Webkom} alt="Webkom logo" />

      <div className="mx-auto flex items-center gap-4 py-10">
        <Image src={Andreas} alt="Andreas Bakseter" width={100} height={100} />
        <Image src={Bo} alt="Bo Aanes" width={100} height={100} />
      </div>

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

        {/* --- H20 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Alvar Hønsi</ListItem> {/* Sluttet i V23 */}
          <ListItem>Øyvind Grutle</ListItem> {/* Sluttet i V23 */}
          <ListItem>Sander Sigmundstad</ListItem> {/* Sluttet i V21 */}
          <ListItem>Victoria Valner</ListItem> {/* Sluttet i V20 */}
        </UnorderedList>

        {/* --- H21 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Nikolaus Engh</ListItem> {/* Sluttet i V25 */}
          <ListItem>Ole Magnus Fon Johnsen</ListItem>
          <ListItem>Mathilde Bergenheim</ListItem> {/* Sluttet i V22 */}
          <ListItem>Thea Jenny Kolnes</ListItem> {/* Sluttet i H23 */}
          <ListItem>Felix Kaasa</ListItem> {/* Sluttet i V24 */}
        </UnorderedList>

        {/* --- H22 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Torger Bocianowski</ListItem> {/* Sluttet i V24 */}
          <ListItem>Malin Torset Sivertstøl</ListItem> {/* Sluttet i H23 */}
          <ListItem>Karolina Gil</ListItem>
          <ListItem>Leoul Zinaye Tefera</ListItem> {/* Sluttet i V23 */}
          <ListItem>Kjetil Alvestad</ListItem> {/* Sluttet i V24 */}
          <ListItem>Jonas Hammerseth</ListItem> {/* Sluttet i V24 */}
        </UnorderedList>

        {/* --- H23 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Johanne Blikberg Herheim</ListItem>
          <ListItem>Kristian Elde Johansen</ListItem> {/* Sluttet i V25 */}
          <ListItem>Swarnika Sellathurai</ListItem> {/* Sluttet i H24 */}
          <ListItem>Zeno Elio Leonardi</ListItem>
          <ListItem>Izaak Sarnecki</ListItem>
          <ListItem>Wengeal Abebe</ListItem> {/* Sluttet i H24 */}
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
<<<<<<< HEAD

        {/* --- H25 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Githan Mayurathan</ListItem>
=======
        {/* --- H25 --- */}
        <UnorderedList className="list-none p-0 text-lg">
          <ListItem>Mikael Øverland</ListItem>
>>>>>>> c41f02d8 (First commit)
        </UnorderedList>
      </div>
    </Container>
  );
}
