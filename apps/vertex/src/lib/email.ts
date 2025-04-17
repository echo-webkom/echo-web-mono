export const isEmail = (str: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
	return emailRegex.test(str);
};
