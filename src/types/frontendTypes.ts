import { TypeContext } from 'typedoc';

export type { TypeContext } from 'typedoc';
import { ReflectionKind as TdocReflectionKind } from 'typedoc';
import { treeMenuRoot } from './types';

export type ReflectionKind = typeof TdocReflectionKind;
export type yafState = {
	reflectionMap: reflectionMap;
	reflectionKind: ReflectionKind;
	kindSymbols: kindSymbols;
	navigationMenu: treeMenuRoot;
	pageDataCache: { [key: string]: unknown };
	drawers: drawers;
};

export type YAFReflectionLink = {
	name: string;
	fileName: string;
	level: number;
};
export type reflectionMap = {
	[key: number]: YAFReflectionLink;
};

export interface kindSymbol {
	className: string;
	symbol: string;
}
export type kindSymbols = { [key: number]: kindSymbol };

export type drawerState = 'open' | 'closed';
export type drawersState = {
	drawers: {
		[key: string]: drawerState;
	};
	scrollTop: number;
};
export type drawers = {
	menu: drawersState;
	content: { [key: string]: drawersState };
};

export type localStorageKey = 'menu' | 'content';
export type drawerContext = localStorageKey | null;

export type componentName = `${string}-${string}`;
export type parenthesisMap = Record<TypeContext, boolean>;
export type materialIcon =
	| 'expand_more'
	| 'expand_less'
	| 'question_mark'
	| 'home'
	| 'highlight_off'
	| 'link';

export type abnormalSigTypes =
	| { type: 'named-tuple-member' }
	| { type: 'template-literal' };

export type clickEvent = Event & { ctrlKey: boolean };
