import { localStorageKey } from '../../types/frontendTypes.js';
import { htmlString } from '../../types/types.js';

export default class ErrorHandlers {
	static template = (err: unknown): htmlString =>
		`<yaf-error>${(<{ message: string }>err).message}</yaf-error>`;

	static data = (err: unknown) => {
		console.error(err);
		return err;
	};

	static notFound = (message: string) => {
		throw Error(message);
	};

	static localStorage = (key: localStorageKey) => {
		console.error(
			`There was a problem with "localStorage.${key}. It is being removed.`
		);
		window.localStorage.removeItem('key');
	};
}
