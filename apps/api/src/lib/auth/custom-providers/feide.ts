import { OAuth2Provider } from "arctic";
import { OAuth2Client } from "oslo/oauth2";

const authorizeEndpoint = "https://auth.dataporten.no/oauth/authorization";
const tokenEndpoint = "https://auth.dataporten.no/oauth/token";

export interface FeideTokens {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  scope: string;
  idToken: string;
}

export class Feide implements OAuth2Provider {
  private client: OAuth2Client;
  private clientSecret: string;

  constructor(
    clientId: string,
    clientSecret: string,
    options?: {
      redirectURI?: string;
    },
  ) {
    this.client = new OAuth2Client(clientId, authorizeEndpoint, tokenEndpoint, {
      redirectURI: options?.redirectURI,
    });
    this.clientSecret = clientSecret;
  }

  public async createAuthorizationURL(
    state: string,
    options?: {
      scopes?: string[];
    },
  ): Promise<URL> {
    const url = await this.client.createAuthorizationURL({
      scopes: options?.scopes ?? [],
    });
    url.searchParams.set("state", state);
    return url;
  }

  public async validateAuthorizationCode(code: string): Promise<FeideTokens> {
    const result = await this.client.validateAuthorizationCode<{
      access_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
      id_token: string;
    }>(code, {
      authenticateWith: "request_body",
      credentials: this.clientSecret,
    });

    const tokens: FeideTokens = {
      accessToken: result.access_token,
      tokenType: result.token_type,
      expiresAt: new Date().getTime() / 1000 + result.expires_in,
      scope: result.scope,
      idToken: result.id_token,
    };

    return tokens;
  }
}
