import { Grid3x3 } from "lucide-react";

import { Heading } from "@/components/typography/heading";

import { Container } from "../../../../components/container";
import { StaticPageSidebar } from "../../../../lib/static-page-sidebar";
import SpillKort from "./components/spillkort";

export default function Spill() {
  const gameslist = [
    {
      name: "Dagens ord",
      description: "Prøv å finne ordet",
      path: "/for-studenter/spill/dagens-ord",
      icon: Grid3x3,
    },
  ];

  return (
    <div>
      <Container className="flex flex-row py-10">
        <StaticPageSidebar />
        <div className="space-y-8">
          <Heading className="">Spill</Heading>
          <div className="w-full">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {gameslist.map((game) => (
                <SpillKort
                  key={game.name}
                  name={game.name}
                  description={game.description}
                  path={game.path}
                  icon={game.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
