import {type GetServerSideProps} from "next";
import Head from "next/head";

import {getServerSession} from "@echo-webkom/auth";

import AdminLayout from "@/layouts/admin";

const AdminPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p>På denne siden kan du se informasjon om brukere og se tilbakemeldinger.</p>
      </AdminLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx);

  if (session?.user.role !== "ADMIN") {
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

export default AdminPage;
