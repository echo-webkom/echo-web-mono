import { OAuth2Client, type OAuth2Tokens } from "arctic";
import ky from "ky";

import { BASE_URL } from "@/config";

export type FeideUserInfo = {
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

const FEIDE_SCOPES = ["openid", "email", "profile", "groups"];

class Feide {
  #oauthClient: OAuth2Client;
  #authorizationEndpoint = "https://auth.dataporten.no/oauth/authorization";
  #tokenEndpoint = "https://auth.dataporten.no/oauth/token";
  #userInfoEndpoint = "https://auth.dataporten.no/openid/userinfo";

  constructor(clientId: string, clientSecret: string) {
    this.#oauthClient = new OAuth2Client(
      clientId,
      clientSecret,
      `${BASE_URL}/api/auth/callback/feide`,
    );
  }

  createAuthorizationURL(state: string): URL {
    return this.#oauthClient.createAuthorizationURL(
      this.#authorizationEndpoint,
      state,
      FEIDE_SCOPES,
    );
  }

  validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
    return this.#oauthClient.validateAuthorizationCode(this.#tokenEndpoint, code, null);
  }

  async getUserInfo(accessToken: string): Promise<FeideUserInfo> {
    const response = await ky.get<FeideUserInfo>(this.#userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info from Feide");
    }

    return await response.json();
  }
}

const feideClientId = process.env.FEIDE_CLIENT_ID;
const feideClientSecret = process.env.FEIDE_CLIENT_SECRET;

if (!feideClientId || !feideClientSecret) {
  console.error("FEIDE_CLIENT_ID and FEIDE_CLIENT_SECRET environment variables must be set");
}

export const feide = new Feide(feideClientId!, feideClientSecret!);
