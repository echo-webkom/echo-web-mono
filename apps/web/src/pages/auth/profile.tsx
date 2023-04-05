import Head from "next/head";
import {type GetServerSideProps} from "next/types";
import {useSession} from "next-auth/react";

import {getServerSession} from "@echo-webkom/auth";

import {api} from "@/utils/api";
import Container from "@/components/container";
import Layout from "@/components/layout";
import UserForm from "@/components/user-form";

const ProfilePage = () => {
  const _ = useSession({
    required: true,
  });

  const {data: user} = api.auth.me.useQuery();

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
              <p className="text-xl font-bold">{user?.name}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">E-post:</p>
              <p className="text-xl font-bold">{user?.email}</p>
            </div>
          </div>
          <hr className="my-4" />

          {user && <UserForm user={user} />}
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
