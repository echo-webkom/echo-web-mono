import type { ValidatedUser } from '$lib/auth/validate';
import { setContext, getContext } from 'svelte';

const AUTH_CONTEXT_KEY = Symbol('auth');

export type AuthContext = {
	user: ValidatedUser | null;
};

export const setAuthContext = (ctx: AuthContext) => {
	setContext(AUTH_CONTEXT_KEY, ctx);
};

export const getAuth = () => {
	const ctx = getContext<AuthContext>(AUTH_CONTEXT_KEY);
	if (!ctx) {
		throw new Error('No auth context found');
	}
	return ctx;
};
