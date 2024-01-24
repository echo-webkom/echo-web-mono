import { type OAuthConfig } from "next-auth/providers";

type FeideProfile = {
  iss: string;
  jti: string;
  aud: string;
  sub: string;
  iat: number;
  exp: number;
  auth_time: number;
  email: string;
  name: string;
  picture: string;
};

export function Feide(options: Partial<OAuthConfig<FeideProfile>>): OAuthConfig<FeideProfile> {
  return {
    id: "feide",
    name: "Feide",
    type: "oauth",
    issuer: "https://auth.dataporten.no",
    wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
    accessTokenUrl: "https://auth.dataporten.no/oauth/token",
    jwks_endpoint: "https://auth.dataporten.no/openid/jwks",
    userinfo: "https://auth.dataporten.no/openid/userinfo",
    token: "https://auth.dataporten.no/oauth/token",
    authorization: {
      params: {
        scope: "email openid profile groups",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    ...options,
  };
}
