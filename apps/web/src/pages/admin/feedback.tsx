import Head from "next/head";

import AdminLayout from "@/layouts/admin";
import {withAdminCheck} from "@/lib/checks/with-admin-auth";
import {api} from "@/utils/api";
import {norwegianDateString} from "@/utils/date";

const AdminPage = () => {
  const feedback = api.feedback.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout title="Tilbakemeldinger">
        <div className="mt-5">
          {feedback.isLoading && <p>Laster...</p>}

          {feedback.isSuccess && (
            <ul className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {feedback.data.map((feedback) => (
                <li
                  key={feedback.id}
                  className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-xs text-muted-foreground">
                      {norwegianDateString(feedback.createdAt)}
                    </p>
                    <h3 className="font-medium">Fra: {feedback.name ?? "Ikke oppgit"}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{feedback.email}</p>

                    <hr className="my-3" />

                    <div>
                      <p className="break-words text-sm text-muted-foreground">
                        {/* Show line breaks */}
                        {feedback.message.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
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

export const getServerSideProps = withAdminCheck(() => {
  return {
    props: {},
  };
});

export default AdminPage;
