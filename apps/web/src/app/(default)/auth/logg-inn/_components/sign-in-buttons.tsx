import Image from "next/image";
import Link from "next/link";

import EchoLogo from "@/assets/images/echo-logo.png";
import { Feide } from "@/components/icons/feide";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: "feide",
    name: "Feide",
  },
];

export const SignInButtons = () => {
  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col rounded-xl border-2 border-muted-dark bg-muted p-8">
      <Image src={EchoLogo} alt="echo logo" width={100} height={100} className="mx-auto" />

      <Heading level={3} className="mx-auto mb-8">
        Velg en måte å logge inn
      </Heading>

      <div className="mb-4 flex flex-col justify-center gap-3">
        {providers.map(({ id, name }) => (
          <div key={id}>
            <Button
              className="group w-full gap-2 border-feide-dark bg-feide hover:border-feide hover:bg-feide-hover hover:text-black"
              asChild
            >
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/${id}?app=site`}>
                <Feide className="h-5 w-5" />
                Logg inn med {name}
              </a>
            </Button>
          </div>
        ))}
      </div>

      <Text size="sm" className="text-muted-foreground">
        For å kunne logge inn må du være medlem av echo.{" "}
        <Link className="underline" href="/om/vedtekter#§-2-medlemmer">
          Les mer her.
        </Link>
      </Text>
    </div>
  );
};
