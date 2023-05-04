import Head from "next/head";
import Link from "next/link";
import {type GetServerSideProps} from "next/types";

import {getServerSession} from "@echo-webkom/auth";
import {registrationStatusToString} from "@echo-webkom/lib";

import Container from "@/components/container";
import LoadingComponent from "@/components/page-loader";
import {ButtonLink} from "@/components/ui/button";
import UserForm from "@/components/user-form";
import DefaultLayout from "@/layouts/default";
import {api} from "@/utils/api";

const ProfilePage = () => {
  const user = api.auth.me.useQuery();

  return (
    <>
      <Head>
        <title>Profil</title>
      </Head>
      <DefaultLayout>
        <Container className="max-w-xl">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-lg text-muted-foreground">Navn:</p>
              <p className="text-xl font-bold">{user.data?.name}</p>
            </div>
            <div>
              <p className="text-lg text-muted-foreground">E-post:</p>
              <p className="text-xl font-bold">{user.data?.email}</p>
            </div>
          </div>

          <hr className="my-4" />

          <h2 className="text-2xl font-bold">Dine arrangementer</h2>

          <div className="flex flex-col gap-3">
            {user.data?.Registration.length === 0 && (
              <p className="text-lg text-muted-foreground">
                Du er ikke påmeldt noen arrangementer.
              </p>
            )}
            {user.data?.Registration.map((registration) => (
              <div className="flex flex-col gap-2" key={registration.happeningSlug}>
                <div className="flex items-center justify-between">
                  <Link
                    href={`${registration.happening.type === "BEDPRES" ? "/bedpres" : "/event"}/${
                      registration.happening.slug
                    }`}
                    className="text-lg font-bold hover:underline"
                  >
                    {registration.happening.title}
                  </Link>
                  <p>{registrationStatusToString[registration.status]}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {user.isLoading && <LoadingComponent />}
          {user.data && <UserForm user={user.data} refetchUser={() => user.refetch} />}

          {user.data?.role === "ADMIN" && (
            <ButtonLink href="/admin" variant="link">
              Til admin dashboard
            </ButtonLink>
          )}
        </Container>
      </DefaultLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
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
