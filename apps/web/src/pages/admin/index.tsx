import Head from "next/head";

import AdminLayout from "@/layouts/admin";
import {withAdminCheck} from "@/lib/checks/with-admin-auth";

const AdminPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout title="Admin Dashboard">
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
