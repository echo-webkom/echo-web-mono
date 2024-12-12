import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { OAuth2Client } from 'arctic';

const redirectUri = dev
	? 'http://localhost:5173/auth/feide/callback'
	: 'https://beta.echo.uib.no/auth/feide/callback';

export const FEIDE_AUTHORIZATION_ENDPOINT = 'https://auth.dataporten.no/oauth/authorization';
export const FEIDE_TOKEN_ENDPOINT = 'https://auth.dataporten.no/oauth/token';
export const FEIDE_USERINFO_ENDPOINT = 'https://auth.dataporten.no/openid/userinfo';

const internalFeideClient = new OAuth2Client(
	env.FEIDE_CLIENT_ID!,
	env.FEIDE_CLIENT_SECRET!,
	redirectUri
);

export const feide = {
	/**
	 * Create an authorization URL
	 *
	 * @param state
	 * @returns
	 */
	createAuthorizationUrl: (state: string) =>
		internalFeideClient.createAuthorizationURL(FEIDE_AUTHORIZATION_ENDPOINT, state, [
			'email',
			'openid',
			'profile',
			'groups'
		]),

	/**
	 * Validate the authorization code
	 *
	 * @param code
	 * @returns
	 */
	validateAuthorizationCode: (code: string) =>
		internalFeideClient.validateAuthorizationCode(FEIDE_TOKEN_ENDPOINT, code, null),

	/**
	 * Get user information from the Feide API
	 *
	 * @param accessToken
	 * @returns
	 */
	getUser: async (accessToken: string) => {
		const response = await fetch(FEIDE_USERINFO_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		return (await response.json()) as {
			aud: string;
			sub: string;
			'connect-userid_sec': Array<unknown>;
			'dataporten-userid_sec': Array<unknown>;
			'https://n.feide.no/claims/userid_sec': Array<unknown>;
			name: string;
			email: string;
			email_verified: boolean;
		};
	}
};
