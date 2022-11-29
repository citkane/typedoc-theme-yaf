import { htmlString, localStorageKey } from '../../types/types.js';

export const errorHandlers = {
	template: (err: unknown): htmlString =>
		`<yaf-error>${(<{ message: string }>err).message}</yaf-error>`,
	data: (err: unknown) => {
		console.error(err);
		return err;
	},
	notFound: (message: string) => {
		throw Error(message);
	},
	localStorage: (key: localStorageKey) => {
		console.error(
			`There was a problem with "localStorage.${key}. It is being removed.`
		);
		window.localStorage.removeItem('key');
	},
};
