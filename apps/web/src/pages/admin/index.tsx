import Head from "next/head";

import AdminLayout from "@/layouts/admin";
import {withAdminCheck} from "@/lib/checks/with-admin-auth";

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

export const getServerSideProps = withAdminCheck(() => {
  return {
    props: {},
  };
});

export default AdminPage;
