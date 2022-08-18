declare global {
	interface Window { 
		yaf:yafModel,
		searchData: object
	}
}

export interface yafModel {
	rootSubPaths: string[],
	navigation: {
		menu: {
			tree: treeMenuRoot,
		}
	}
}
export type cache = {[key: string]: unknown}
export interface dataCache {
	yaf: yafModel
}

export type componentName = `${string}-${string}`;
export type treeMenuRoot = {
	[key: number]: treeMenuBranch
}
export type treeMenuBranch = {
	'name': string,
	'url': string,
	'children': treeMenuRoot
}
export type contentFragment = `${string}.html`;
export type contentHash = `#${string}`;
export type contentLocation = {
	fragment: contentFragment,
	hash: contentHash | ""
}

export type html = `<${string}>${string}</${string}>`|`<${string} />`;
export type customElement = Element & {props: any}

/**
 * The [standard](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event) javascript custom event options
 * with 'details' included.
 * 
 */
export type customEventOptions = {
	/** Data payload to be included in the event */
	detail: any,
	/** A boolean value indicating whether the event bubbles. The default is false.  */
	bubbles?: boolean,
	/** A boolean value indicating whether the event can be cancelled. The default is false.  */
	cancelable?: boolean,
	/** A boolean value indicating whether the event will trigger listeners outside of a shadow root. The default is false.  */
	composed?: boolean
}