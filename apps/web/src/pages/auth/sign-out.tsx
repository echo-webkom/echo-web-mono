import type {GetServerSideProps} from "next";
import Button from "@/components/button";
import Container from "@/components/container";
import Layout from "@/components/layout";
import {getServerSession} from "@echo-webkom/auth";
import {signOut} from "next-auth/react";

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
