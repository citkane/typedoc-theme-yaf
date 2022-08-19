declare global {
	interface Window {
		yaf: yafModel;
		searchData: object;
	}
}

export interface yafModel {
	rootSubPaths: string[];
	navigation: {
		menu: {
			tree: treeMenuRoot;
		};
	};
}
export type cache = { [key: string]: unknown };
export interface dataCache {
	yaf: yafModel;
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
