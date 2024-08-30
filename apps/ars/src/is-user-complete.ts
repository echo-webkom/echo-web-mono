import type { DBUser } from "./queries";

type CompleteUser = DBUser & {
  degreeId: string;
  year: number;
  hasReadTerms: boolean;
};

export const isUserComplete = (user: DBUser): user is CompleteUser => {
  if (!user.degreeId || !user.year || !user.hasReadTerms) {
    return false;
  }

  return true;
};
