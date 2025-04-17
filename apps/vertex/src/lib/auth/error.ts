export const SignInError = {
	NOT_MEMBER_OF_ECHO: 'NOT_MEMBER_OF_ECHO',
	NO_ASSOCIATED_EMAIL: 'NO_ASSOCIATED_EMAIL',
	INVALID_TOKEN: 'INVALID_TOKEN',
	INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

export type ISignInError = (typeof SignInError)[keyof typeof SignInError];

export const isValidSignInError = (error: string): error is keyof typeof SignInError =>
	Object.keys(SignInError).includes(error);
