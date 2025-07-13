import type { ValidatedUser } from '$lib/auth/validate';
import { setContext, getContext } from 'svelte';

const AUTH_CTX = Symbol('auth');

type AuthContext = {
	user: ValidatedUser | null;
};

export const AuthContext = {
	set: (ctx: AuthContext) => {
		setContext(AUTH_CTX, ctx);
	},
	get: () => {
		const ctx = getContext<AuthContext>(AUTH_CTX);
		if (!ctx) {
			throw new Error('No auth context found');
		}
		return ctx;
	}
};
