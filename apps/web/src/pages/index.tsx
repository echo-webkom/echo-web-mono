import Link from "next/link";
import {useState} from "react";
import * as Switch from "@radix-ui/react-switch";

import {Button, Layout} from "@/components";
import {fetchEventPreviews} from "@/api";
import {signOut, useSession} from "next-auth/react";

interface Props {
  eventPreviews: Awaited<ReturnType<typeof fetchEventPreviews>>;
}

const HomePage = ({eventPreviews}: Props) => {
  const {data: userSession} = useSession();
  const [checked, setChecked] = useState(true);

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex gap-3">
          <span>Vis bedpresser:</span>{" "}
          <Switch.Root
            onCheckedChange={(b) => setChecked(b)}
            defaultChecked={checked}
            className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray-200 outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-400 data-[state=checked]:bg-echo-yellow"
          >
            <Switch.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        </div>

        {userSession && <Button onClick={() => void signOut()}>Logg ut</Button>}

        {checked && (
          <>
            <h2 className="text-3xl font-bold">Bedpresser</h2>
            <ul className="flex flex-col gap-3">
              {eventPreviews.map((event) => (
                <li key={event._id}>
                  <div className="rounded-md bg-black/5 p-5">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <Link className="underline" href={`/event/${event.slug}`}>
                      Les mer!
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const eventPreviews = await fetchEventPreviews("BEDPRES", 30);

  return {
    props: {
      eventPreviews,
    },
  };
};

export default HomePage;
