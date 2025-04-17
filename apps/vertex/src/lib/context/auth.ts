import type { AuthState } from '$lib/state/auth.svelte';
import { setContext, getContext } from 'svelte';

const AUTH_CONTEXT_KEY = Symbol('auth');

export type AuthContext = {
	state: AuthState;
};

export const setAuthContext = (ctx: AuthContext) => {
	setContext(AUTH_CONTEXT_KEY, ctx);
};

export const getAuthContext = () => {
	const ctx = getContext<AuthContext>(AUTH_CONTEXT_KEY);
	if (!ctx) {
		throw new Error('No auth context found');
	}
	return ctx;
};
