/**
 * @module Types
 */

declare global {
	interface Window {
		searchData: object;
		yaf: {
			flushStateCache: () => void;
		};
	}
}
import { JSONOutput } from 'typedoc';

export type htmlString = `<${string}>${string}</${string}>` | `<${string} />`;
export type yafReflectionText = {
	readme?: htmlString;
	comment?: htmlString;
};

export interface YAFDataObject
	extends JSONOutput.SignatureReflection,
		JSONOutput.DeclarationReflection,
		JSONOutput.ProjectReflection,
		JSONOutput.ContainerReflection {
	version?: string;
	children?: YAFDataObject[];
	is: {
		leaf: boolean;
		project: boolean;
		declaration: boolean;
		memberDeclaration: boolean;
		reflection: boolean;
		referenceReflection: boolean;
	};
	location: {
		query: string;
		hash: string;
	};
	text?: yafReflectionText;
	has: {
		typeParameters: boolean;
		getterOrSetter: boolean;
		comment: boolean;
	};
	signatures: YafSignatureReflection[];
	getSignature: YafSignatureReflection;
	setSignature: YafSignatureReflection;
	typeParameter: YafTypeParameterReflection[];
	parameters: YafParameterReflection[];
	hierarchy?: hierarchy[];
	idPrefix?: string;
}

export interface YafDeclarationReflection
	extends JSONOutput.DeclarationReflection {
	parameters?: YafParameterReflection[];
	typeParameters?: YafTypeParameterReflection[] | undefined;
	text?: yafReflectionText;
	type: JSONOutput.ReflectionType;
	idPrefix?: string;
}
export interface YafSignatureReflection extends JSONOutput.SignatureReflection {
	parameters?: YafParameterReflection[];
	typeParameter?: YafTypeParameterReflection[];
	text?: yafReflectionText;
	sources?: YafDeclarationReflection['sources'];
	implementedBy?: YafDeclarationReflection['implementedBy'];
	defaultValue?: unknown;
}
export interface YafParameterReflection extends JSONOutput.ParameterReflection {
	text?: yafReflectionText;
}
export interface YafTypeParameterReflection
	extends JSONOutput.TypeParameterReflection {
	text?: yafReflectionText;
}

export type hierarchy = {
	name: string;
	linkId?: string;
	isTarget?: boolean;
	children?: hierarchy[];
};
export type treeMenuRoot = {
	[key: number]: treeMenuBranch;
};
export type treeMenuBranch = {
	name: string;
	query: string;
	hash: string | '';
	kind: number;
	id: number;
	flags: JSONOutput.ReflectionFlags;
	children: treeMenuRoot;
	parentDrawerElement?: HTMLElement;
	inheritedFrom?: string | undefined;
};

export type YAFReflectionLink = {
	name: string;
	fileName: string;
	id?: string;
	kind?: number;
	target?: number;
	flags?: undefined;
	signatures?: undefined;
	comment?: undefined;
	groups?: undefined;
	getSignature?: undefined;
	setSignature?: undefined;
	idPrefix?: string;
};
export type reflectionMap = {
	[key: string]: YAFReflectionLink;
};

export interface kindSymbol {
	className: string;
	symbol: string;
}
export type kindSymbols = { [key: number]: kindSymbol };

export type needsParenthesis = Record<string, Record<string, boolean>>;
