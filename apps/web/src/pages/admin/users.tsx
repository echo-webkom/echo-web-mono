import Head from "next/head";

import AdminLayout from "@/layouts/admin";
import {withAdminCheck} from "@/lib/checks/with-admin-auth";
import {api} from "@/utils/api";

const AdminPage = () => {
  const users = api.user.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout>
        <h1 className="text-3xl font-bold">Brukere</h1>

        <div className="mt-5">
          {users.isLoading && <p>Laster...</p>}

          {users.isSuccess && (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {users.data.map((user) => (
                <li key={user.id} className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">E-post: {user.email}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Alternativ e-post: {user.alternativeEmail ?? "Ikke satt"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Studieprogram: {user.degree ?? "Ikke satt"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Årstrinn: {user.year ?? "Ikke satt"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Rolle: {user.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
