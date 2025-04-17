import type { ValidatedUser } from '$lib/auth/validate';

export class AuthState {
	user = $state<ValidatedUser | null>(null);

	constructor(user: ValidatedUser | null) {
		this.user = user;
	}
}
