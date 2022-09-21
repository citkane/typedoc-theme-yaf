/**
 * @module webComponents/types
 */

export { YAFDataObject, htmlString, allTypes, reflectionMap } from '../types';

export type { TypeContext } from 'typedoc';

declare global {
	interface Window {
		searchData: object;
	}
}

export type treeMenuRoot = {
	[key: number]: treeMenuBranch;
};
export type treeMenuBranch = {
	name: string;
	query: string;
	hash: string | '';
	children: treeMenuRoot;
};
export type fragmentUrl = `${string}.html` | `${string}.css`;
export type contentHash = `#${string}` | '';

export type contentUrl = {
	fragment: fragmentUrl;
	hash: contentHash;
};

//export type css = `${string}{${string}}`;

export type componentName = `${string}-${string}`;
export type dotName = `${string}.${string}`;
export type pathString = '/' | `/${string}`;
