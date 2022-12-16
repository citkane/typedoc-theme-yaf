import { TypeContext } from 'typedoc';

export type { TypeContext } from 'typedoc';
import { ReflectionKind as TdocReflectionKind } from 'typedoc';
import YafElementDrawers from '../frontend/YafElementDrawers.js';
import {
	kindSymbols,
	needsParenthesis,
	reflectionMap,
	treeMenuRoot,
} from './types';

export type ReflectionKind = typeof TdocReflectionKind;
export interface yafState {
	reflectionMap: reflectionMap;
	reflectionKind: ReflectionKind;
	kindSymbols: kindSymbols;
	needsParenthesis: needsParenthesis;
	navigationMenu: treeMenuRoot;
	pageData: { [key: string]: unknown };
	drawers: { [key: string]: drawerState };
	scrollTop: { [key: string]: number };
	options: {
		display: {
			inherited: displayStates;
			private: displayStates;
		};
	};
}

export type displayStates = 'show' | 'hide';
export type yafDisplayOptions = keyof yafState['options']['display'];

export type drawerState = 'open' | 'closed';

export type componentName = `${string}-${string}`;
export type parenthesisMap = Record<TypeContext, boolean>;
export type materialIcon =
	| 'expand_more'
	| 'expand_less'
	| 'question_mark'
	| 'home'
	| 'highlight_off'
	| 'link';

export type clickEvent = Event & { ctrlKey: boolean };

export type localStorageKey =
	| 'drawers'
	| 'scrollTop'
	| 'options'
	| 'displayOptions';

export type DrawerElement = HTMLElement & YafElementDrawers;

export type debouncer = Record<string, unknown>;

export type yafEventList = Array<[string, unknown, (HTMLElement | Window)?]>;
