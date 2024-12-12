const BYLAWS_PATH = 'https://raw.githubusercontent.com/echo-uib/Vedtekter/main/vedtekter.md';
const ETHICAL_GUIDELINES_PATH =
	'https://raw.githubusercontent.com/echo-uib/Retningslinjer/main/Etiske_retningslinjer.md';

export const fetchByLaws = async () => {
	return await fetch(BYLAWS_PATH).then((res) => res.text());
};

export const fetchEthicalGuidelines = async () => {
	return await fetch(ETHICAL_GUIDELINES_PATH).then((res) => res.text());
};
