import type {GetServerSideProps} from "next";
import {signOut} from "next-auth/react";

import {getServerSession} from "@echo-webkom/auth";

import Container from "@/components/container";
import {Button} from "@/components/ui/button";
import Layout from "@/layouts/layout";

const LoginPage = () => {
  return (
    <Layout>
      <Container>
        <div className="flex flex-col justify-center gap-3">
          <div className="mx-auto">
            <Button
              onClick={() =>
                void signOut({
                  callbackUrl: "/",
                })
              }
            >
              Logg ut
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
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

export default LoginPage;
