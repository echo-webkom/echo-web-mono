import {type GetServerSideProps} from "next";
import {getProviders, getSession, signIn} from "next-auth/react";

import Button from "@/components/button";
import Container from "@/components/container";
import Layout from "@/components/layout";

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};

const LoginPage = ({providers}: Props) => {
  return (
    <Layout>
      <Container>
        {providers ? (
          <>
            <h1 className="mb-10 text-center text-3xl font-bold">Velg en måte å logge inn på</h1>
            <div className="flex flex-col justify-center gap-3">
              {Object.values(providers).map((provider) => (
                <div className="mx-auto" key={provider.name}>
                  <Button
                    onClick={() =>
                      void signIn(provider.id, {
                        callbackUrl: "/auth/profile",
                      })
                    }
                  >
                    Logg inn med {provider.name}
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center gap-3">
            <h1 className="mb-10 text-center text-3xl font-bold">
              Ingen tilgjengelige innloggingstjenester
            </h1>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const providers = await getProviders();
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      providers,
    },
  };
};

export default LoginPage;
