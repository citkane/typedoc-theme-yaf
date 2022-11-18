import { parenthesisMap, treeMenuBranch, TypeContext } from '../types';

/**
 * Converts a component name of the structure `yaf-component-name` to camelcase, ie `yafComponentName`.
 * @param componentName
 * @returns
 */
export const toCamelCase = (componentName: string) => {
	const varNameArray = componentName.split('-').map((item, i) => {
		return i ? `${item.charAt(0).toUpperCase()}${item.slice(1)}` : item;
	});
	return varNameArray.join('');
};

/**
 * Fetches a file from the server
 * @param filePath
 * @param type
 * @returns
 */
export const fetchFile = (
	filePath: string,
	type: 'json' | 'text'
): Promise<object | string> =>
	new Promise((resolve, reject) => {
		return fetch(filePath).then((stream) => {
			if (stream.ok) {
				resolve(stream[type]());
			} else {
				reject(new Error(`${stream.statusText}: ${filePath}`));
			}
		});
	});

/* 
 * I dont think we need this
 *
export const wbr = (string: string) => {
	const pieces = string.split(/(?=_|-|[A-Z])/);
	return pieces.join('<wbr />');
};
*/

/**
 * A utility for mapping a signature type to a context and returning if it needs parenthesis
 */
export const needsParenthesis = {
	array: () => false,
	conditional: (context: TypeContext) => {
		const map: Partial<parenthesisMap> = {
			arrayElement: true,
			conditionalCheck: true,
			conditionalExtends: true,
			indexedObject: true,
			inferredConstraint: true,
			intersectionElement: true,
			optionalElement: true,
			typeOperatorTarget: true,
			restElement: true,
			unionElement: true,
		};
		return map[context] === true;
	},
	indexedAccess: () => false,
	inferred: (context: TypeContext) => {
		const map: Partial<parenthesisMap> = {
			arrayElement: true,
			indexedObject: true,
			optionalElement: true,
			restElement: true,
		};
		return map[context] === true;
	},
	intersection: (context: TypeContext) => {
		const map: Partial<parenthesisMap> = {
			arrayElement: true,
			conditionalCheck: true,
			indexedObject: true,
			optionalElement: true,
			typeOperatorTarget: true,
			restElement: true,
		};
		return map[context] === true;
	},
	intrinsic: () => false,
	literal: () => false,
	mapped: () => false,
	'named-tuple-member': () => false,
	optional: () => false,
	predicate: () => false,
	query: () => false,
	reference: () => false,
	reflection: () => false,
	rest: () => false,
	'template-literal': () => false,
	tuple: () => false,
	typeOperator: (context: TypeContext) => {
		const map: Partial<parenthesisMap> = {
			arrayElement: true,
			indexedObject: true,
			optionalElement: true,
		};
		return map[context] === true;
	},
	union: (context: TypeContext) => {
		const map: Partial<parenthesisMap> = {
			arrayElement: true,
			conditionalCheck: true,
			indexedObject: true,
			intersectionElement: true,
			optionalElement: true,
			typeOperatorTarget: true,
		};
		return map[context] === true;
	},
	unknown: (context: TypeContext) => context !== 'none',
};

export const treeBranchSort = (branches: treeMenuBranch[]) =>
	branches
		.sort((a, b) => b.name.localeCompare(a.name))
		.sort((a, b) => (a.kind > b.kind ? -1 : 1));
