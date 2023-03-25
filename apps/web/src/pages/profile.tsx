import type {GetServerSideProps} from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/layout";
import {getServerSession} from "@echo-webkom/auth";
import {Role} from "@prisma/client";
import {useSession} from "next-auth/react";

const ProfilePage = () => {
  const {data: session} = useSession();

  return (
    <>
      <Head>
        <title>Profil</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-3">
          <h1 className="mb-3 text-4xl font-bold md:text-6xl">Din profil</h1>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-lg text-neutral-500">Navn:</p>
              <p className="text-xl font-bold">{session?.user.name}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">E-post:</p>
              <p className="text-xl font-bold">{session?.user.email}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">Alternativ e-post:</p>
              <p className="text-xl font-bold">{session?.user.alternativeEmail ?? "Ingen"}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">Studieretning:</p>
              <p className="text-xl font-bold">{session?.user.degree ?? "Ingen"}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">Årstrinn:</p>
              <p className="text-xl font-bold">{session?.user.year ?? "Ingen"}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">Studentgruppe:</p>
              <p className="text-xl font-bold">
                {session?.user.studenteGroups ? session.user.studenteGroups.toString() : "Ingen"}
              </p>
            </div>
          </div>

          {session?.user.role === Role.ADMIN && (
            <div>
              <Link href="/dashboard">Til dashboard</Link>
            </div>
          )}
        </div>
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
