import { htmlString } from './types';

export interface highlighter {
	toHtml: (hast: object) => htmlString;
	flagToScope: (lang: string) => string;
	highlight: (text: string, scope: string) => object;
}

export type dataLocation = {
	hash: string;
	query: string;
};
