import { db } from "@echo-webkom/db/serverless";

export const getStudentGroupsWithMembers = async () => {
  return await db.query.groups.findMany({
    orderBy: (group, { asc }) => [asc(group.name)],
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });
};
