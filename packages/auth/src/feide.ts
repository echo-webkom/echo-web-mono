import { type Profile } from "next-auth";
import { type OAuthConfig } from "next-auth/providers";

export function Feide(options: Partial<OAuthConfig<Profile>>): OAuthConfig<Profile> {
  return {
    id: "feide",
    name: "Feide",
    type: "oauth",
    issuer: "https://auth.dataporten.no",
    wellKnown: "https://auth.dataporten.no/.well-known/openid-configuration",
    authorization: {
      params: {
        scope: "email openid profile groups",
      },
    },
    profile(profile) {
      return {
        id: profile.sub!,
        name: profile.name!,
        email: profile.email!,
      };
    },
    ...options,
  };
}
