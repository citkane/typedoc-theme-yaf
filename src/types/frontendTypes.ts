import { JSONOutput, TypeContext } from 'typedoc';
export type { TypeContext } from 'typedoc';

import { ReflectionKind as TdocReflectionKind } from 'typedoc';
import {
	hierarchy,
	kindSymbols,
	needsParenthesis,
	reflectionMap,
	treeMenuRoot,
	YAFDataObject,
	YAFReflectionLink,
	YafSignatureReflection,
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
export type flagCounts = Record<keyof yafState['options']['display'], number>;

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
	| 'menu'
	| 'menu_open'
	| 'search'
	| 'clear';

export type clickEvent = Event & { ctrlKey: boolean };

export type localStorageKey =
	| 'drawers'
	| 'scrollTop'
	| 'options'
	| 'displayOptions';

export type yafEventList = Array<[string, unknown, (HTMLElement | Window)?]>;

export type yafReflectionGroup = {
	title: string;
	children: Omit<YAFDataObject & YAFReflectionLink, 'query'>[];
};

export interface yafHTMLExtension extends HTMLElement {
	appendChildren(children: (HTMLElement | undefined)[] | undefined): void;
	props: unknown;
}

export type yafSignatureProps = {
	type: YAFDataObject['type'];
	context: TypeContext;
};

export type yafSignatureTitleProps = {
	hideName?: boolean;
	arrowStyle?: boolean;
	wrappedInPre?: boolean;
} & YafSignatureReflection;

export type yafContentHierarchyProps = {
	hierarchy: hierarchy[] | undefined;
	pageId?: string;
	init?: boolean;
};

export type yafMemberGroupLinkProps = {
	title: string;
	children: YAFReflectionLink[];
};

export type yafMemberGroupReflectionProps = {
	title: string;
	children: yafReflectionGroup['children'];
	pageId: string;
	nested?: boolean;
	idPrefix?: string;
};

export type yafTypeArgumentsProps = {
	args: JSONOutput.ReferenceType['typeArguments'];
	context: string;
};

export type yafWidgetFlagsProps = {
	flags: string[];
	comment?: JSONOutput.Comment;
};
export type yafWidgetCounterProps = {
	count: number | string;
	fontSize?: string;
};
