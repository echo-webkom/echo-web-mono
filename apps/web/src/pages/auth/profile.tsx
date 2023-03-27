import Head from "next/head";
import {type GetServerSideProps} from "next/types";
import Button, {ButtonLink} from "@/components/button";
import Container from "@/components/container";
import {Input} from "@/components/input";
import Layout from "@/components/layout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {getServerSession} from "@echo-webkom/auth";
import {useSession} from "next-auth/react";

const ProfilePage = () => {
  const {data: session} = useSession({
    required: true,
  });

  return (
    <>
      <Head>
        <title>Profil</title>
      </Head>
      <Layout>
        <Container className="max-w-xl">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-lg text-neutral-500">Navn:</p>
              <p className="text-xl font-bold">{session?.user.name}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">E-post:</p>
              <p className="text-xl font-bold">{session?.user.email}</p>
            </div>
          </div>
          <hr className="my-4" />

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Input placeholder="E-post" />
              <p className="text-sm text-slate-500">E-post du vil vi skal ende til.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Velg årstrinn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bachelor</SelectLabel>
                    <SelectItem value="FIRST">1. trinn</SelectItem>
                    <SelectItem value="SECOND">2. trinn</SelectItem>
                    <SelectItem value="THIRD">3. trinn</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Master</SelectLabel>
                    <SelectItem value="FOURTH">4. trinn</SelectItem>
                    <SelectItem value="FIFTH">5. trinn</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Velg studieretning" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Bachelor</SelectLabel>
                    <SelectItem value="DSIK">Datasikkerhet</SelectItem>
                    <SelectItem value="DTEK">Datateknologi</SelectItem>
                    <SelectItem value="IMO">Informatikk-matematikk-økonomi</SelectItem>
                    <SelectItem value="DVIT">Datavitenskap</SelectItem>
                    <SelectItem value="BINF">Bioinformatikk</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Master</SelectLabel>
                    <SelectItem value="DSC">Master i datascience</SelectItem>
                    <SelectItem value="INF">Master i informatikk</SelectItem>
                    <SelectItem value="PROG">Programvareutvikling</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Annet</SelectLabel>
                    <SelectItem value="MISC">Annet</SelectItem>
                    <SelectItem value="ARMNINF">Årstudium i informatikk</SelectItem>
                    <SelectItem value="POST">Post-bachelor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </form>

          <div className="flex gap-3">
            <Button>Lagre</Button>
            {session?.user.role === "ADMIN" && <ButtonLink href="/">Dashboard</ButtonLink>}
          </div>
        </Container>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default ProfilePage;
