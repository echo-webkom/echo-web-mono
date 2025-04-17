import { PUBLIC_VERTEX_FEIDE_REDIRECT_URI } from '$env/static/public';
import { OAuth2Client, OAuth2Tokens } from 'arctic';

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

const FEIDE_SCOPES = ['openid', 'email', 'profile', 'groups'];

export class Feide {
	#oauthClient: OAuth2Client;
	#authorizationEndpoint = 'https://auth.dataporten.no/oauth/authorization';
	#tokenEndpoint = 'https://auth.dataporten.no/oauth/token';
	#userInfoEndpoint = 'https://auth.dataporten.no/openid/userinfo';

	constructor(clientId: string, clientSecret: string) {
		this.#oauthClient = new OAuth2Client(clientId, clientSecret, PUBLIC_VERTEX_FEIDE_REDIRECT_URI);
	}

	createAuthorizationURL(state: string): URL {
		return this.#oauthClient.createAuthorizationURL(
			this.#authorizationEndpoint,
			state,
			FEIDE_SCOPES
		);
	}

	validateAuthorizationCode(code: string): Promise<OAuth2Tokens> {
		return this.#oauthClient.validateAuthorizationCode(this.#tokenEndpoint, code, null);
	}

	async getUserInfo(accessToken: string): Promise<FeideUserInfo> {
		const response = await fetch(this.#userInfoEndpoint, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch user info: ${response.statusText}`);
		}

		return await response.json();
	}
}
