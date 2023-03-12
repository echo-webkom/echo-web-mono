import type {Provider} from "next-auth/providers";
import {getProviders, getSession, signIn} from "next-auth/react";
import {type GetServerSideProps} from "next";
import {Layout, Button} from "@/components";

type Props = {
  providers: Array<Provider>;
};

const LoginPage = ({providers}: Props) => {
  return (
    <Layout>
      <h1 className="mb-10 text-center text-3xl font-bold">Velg en måte å logge inn på</h1>
      <div className="flex flex-col justify-center gap-3">
        {Object.values(providers).map((provider) => (
          <div className="mx-auto" key={provider.name}>
            <Button
              onClick={() =>
                void signIn(provider.id, {
                  callbackUrl: "/profile",
                })
              }
            >
              Logg inn med {provider.name}
            </Button>
          </div>
        ))}
      </div>
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
