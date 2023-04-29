import {type GetServerSideProps} from "next";
import Head from "next/head";

import {getServerSession} from "@echo-webkom/auth";

import AdminLayout from "@/layouts/admin";
import {api} from "@/utils/api";
import {norwegianDateString} from "@/utils/date";

const AdminPage = () => {
  const feedback = api.feedback.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout>
        <h1 className="text-3xl font-bold">Tilbakemeldinger</h1>

        <div className="mt-5">
          {feedback.isLoading && <p>Laster...</p>}

          {feedback.isSuccess && (
            <ul className="grid w-full max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {feedback.data.map((feedback) => (
                <li
                  key={feedback.id}
                  className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-xs text-muted-foreground">
                      {norwegianDateString(feedback.createdAt)}
                    </p>

                    <h3>Fra: {feedback.name ?? "Ikke oppgit"}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feedback.email}</p>

                    <div className="mt-4">
                      <p className="break-words text-sm text-muted-foreground">
                        {feedback.message}
                      </p>
                    </div>
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
