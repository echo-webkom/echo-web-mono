import Image from "next/image";

import DefaultLayout from "@/layouts/default";

const WebkomPage = () => {
  return (
    <DefaultLayout>
      <div className="text-center text-lg">
        <Image
          className="mx-auto"
          src="/images/webkom.png"
          width={200}
          height={200}
          alt="Webkom logo"
        />
        <h1 className="mb-3 font-display text-4xl font-bold md:text-6xl">Webkom</h1>
        <p className="text-muted-foreground">Tidligere og nåværende medlemmer av echo Webkom.</p>

        <div className="mx-auto my-10 max-w-md">
          <ul>
            <li>Andreas Bakseter (Co-founder)</li>
            <li>Bo Aanes (Co-founder)</li>

            <hr className="my-5" />

            <li>Alvar Hønsi</li>
            <li>Øyvind Grutle</li>
            <li>Sander Sigmundstad</li>
            <li>Victoria Valner</li>
            <li>Nikolaus Engh</li>
            <li>Ole Magnus Fon Johnsen</li>
            <li>Mathilde Bergenheim</li>
            <li>Thea Jenny Kolnes</li>
            <li>Felix Kaasa</li>
            <li>Torger Bocianowski</li>
            <li>Malin Torset Sivertstøl</li>
            <li>Karolina Gil</li>
            <li>Leoul Zinaye Tefera</li>
            <li>Kjetil Alvestad</li>
            <li>Jonas Hammerseth</li>
          </ul>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default WebkomPage;
