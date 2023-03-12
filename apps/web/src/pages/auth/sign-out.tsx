import {signOut} from "next-auth/react";
import {Layout, Button} from "@/components";
import type {GetServerSideProps} from "next";
import {getServerAuthSession} from "@/server/auth";

const LoginPage = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

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
