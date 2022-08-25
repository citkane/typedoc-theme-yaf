declare global {
	interface Window {
		searchData: object;
	}
}
declare module 'webComponents/data/*.json' {
	const value: object;
	export default value;
}
export type componentName = `${string}-${string}`;
export type treeMenuRoot = {
	[key: number]: treeMenuBranch;
};
export type treeMenuBranch = {
	name: string;
	url: fragmentUrl;
	children: treeMenuRoot;
};
export type fragmentUrl = `${string}.html` | `${string}.css`;
export type contentHash = `#${string}` | '';
export type contentUrl = {
	fragment: fragmentUrl;
	hash: contentHash;
};

export type html = `<${string}>${string}</${string}>` | `<${string} />`;
export type css = `${string}{${string}}`;
export type dotName = `${string}.${string}`;
