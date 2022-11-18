/**
 * @module types/frontend
 */

import { TypeContext } from 'typedoc';
import { reflectionMap, kindSymbols } from '../types';

export * from '../types';
export type { TypeContext } from 'typedoc';

export type localStorageKeys = 'menuState';

declare global {
	interface Window {
		searchData: object;
		yaf: {
			reflectionMap: reflectionMap;
			kindSymbols: kindSymbols;
			menuState: {
				menu: { [key: number | string]: 'open' | 'closed' };
				content: { [key: number | string]: 'open' | 'closed' };
				scrollTop: number;
			};
		};
	}
}

export type fragmentUrl = `${string}.html` | `${string}.css`;
export type contentHash = `#${string}` | '';

export interface contentUrl {
	fragment: fragmentUrl;
	hash: contentHash;
}

export type componentName = `${string}-${string}`;
export type dotName = `${string}.${string}`;
export type pathString = '/' | `/${string}`;

export type parenthesisMap = Record<TypeContext, boolean>;

export type materialIcon =
	| 'expand_more'
	| 'expand_less'
	| 'question_mark'
	| 'home'
	| 'highlight_off';
