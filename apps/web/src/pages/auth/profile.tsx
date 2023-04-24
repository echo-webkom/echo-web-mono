import Head from "next/head";
import Link from "next/link";
import {type GetServerSideProps} from "next/types";

import {getServerSession} from "@echo-webkom/auth";

import Container from "@/components/container";
import LoadingComponent from "@/components/page-loader";
import UserForm from "@/components/user-form";
import Layout from "@/layouts/layout";
import {api} from "@/utils/api";

const ProfilePage = () => {
  const user = api.auth.me.useQuery();

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
              <p className="text-xl font-bold">{user.data?.name}</p>
            </div>
            <div>
              <p className="text-lg text-neutral-500">E-post:</p>
              <p className="text-xl font-bold">{user.data?.email}</p>
            </div>
          </div>

          <hr className="my-4" />

          <h2 className="text-2xl font-bold">Dine arrangementer</h2>

          <div className="flex flex-col gap-3">
            {user.data?.Registration.map((registration) => (
              <div className="flex flex-col gap-2" key={registration.happeningSlug}>
                <div className="flex items-center justify-between">
                  <Link
                    href={`${registration.happening.type === "BEDPRES" ? "/bedpres" : "/event"}/${
                      registration.happening.slug
                    }`}
                    className="text-lg font-bold hover:underline"
                  >
                    {registration.happening.slug}
                  </Link>
                  <p>{registration.status}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {user.data ? (
            <UserForm user={user.data} refetchUser={() => user.refetch} />
          ) : (
            <LoadingComponent />
          )}
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
