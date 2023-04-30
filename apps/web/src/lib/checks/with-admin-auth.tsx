import {
  type GetServerSideProps,
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
} from "next";

import {getServerSession, type Session} from "@echo-webkom/auth";

export const withAdminCheck = <P extends {[key: string]: unknown}>(
  getServerSidePropsFunc: (
    context: GetServerSidePropsContext & {session: Session},
  ) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>,
): GetServerSideProps<P> => {
  return async (context): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(context);

    if (!session || session.user.role !== "ADMIN") {
      return {
        redirect: {
          destination: "/auth/sign-in",
          permanent: false,
        },
      };
    }

    const updatedContext = {...context, session};
    const res = await Promise.resolve(getServerSidePropsFunc(updatedContext));

    return res;
  };
};
