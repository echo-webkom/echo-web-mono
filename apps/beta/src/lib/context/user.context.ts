import { type User } from '@echo-webkom/db/schemas';
import { getContext, setContext } from 'svelte';
import { get, type Writable } from 'svelte/store';

export type UserContext = Writable<User | null>;

const AUTH_CONTEXT_KEY = '__auth';

export function setUserContext(value: UserContext) {
	return setContext<UserContext>(AUTH_CONTEXT_KEY, value);
}

export function getUser() {
	return getContext<UserContext>(AUTH_CONTEXT_KEY);
}

export function getAuthenticatedUser() {
	const userStore = getUser();

	if (!get(userStore)) {
		throw new Error('User context not found');
	}

	return userStore as Writable<User>;
}
