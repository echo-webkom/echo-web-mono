import { BASE_URL } from "../../constants";
import { Feide } from "./custom-providers/feide";

type FeideUser = {
  user: {
    userid_sec: [];
    userid: string;
    name: string;
    email: string;
    profilephoto: string;
  };
  audience: string;
};

const FEIDE_USERINFO_URL = "https://auth.dataporten.no/userinfo";

export const FEIDE_SCOPES = ["email", "openid", "profile", "groups"];

export const FEIDE_OAUTH_STATE = "feide_oauth_state";

export const FEIDE_ID = "feide";

export const feide = new Feide(process.env.FEIDE_CLIENT_ID!, process.env.FEIDE_CLIENT_SECRET!, {
  redirectURI: `${BASE_URL}/auth/${FEIDE_ID}/callback`,
});

export async function getFeideUser(
  accessToken: string,
): Promise<{ id: string; email: string; name: string }> {
  const feideUser: FeideUser = await fetch(FEIDE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json());

  return {
    id: feideUser.user.userid,
    email: feideUser.user.email,
    name: feideUser.user.name,
  };
}
