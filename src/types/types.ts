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

//export * from './backendTypes';
//export * from './frontendTypes';

export type htmlString = `<${string}>${string}</${string}>` | `<${string} />`;

export interface YAFDataObject
	extends JSONOutput.SignatureReflection,
		JSONOutput.DeclarationReflection,
		JSONOutput.ProjectReflection,
		JSONOutput.ContainerReflection {
	version: string;
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
	text: {
		readme?: htmlString;
		comment?: htmlString;
	};
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
}

export interface YafDeclarationReflection
	extends JSONOutput.DeclarationReflection {
	parameters?: YafParameterReflection[];
	typeParameters?: YafTypeParameterReflection[] | undefined;
	text: {
		readme?: htmlString;
		comment?: htmlString;
	};
	type: JSONOutput.ReflectionType;
}
export interface YafSignatureReflection extends JSONOutput.SignatureReflection {
	parameters?: YafParameterReflection[];
	typeParameter?: YafTypeParameterReflection[];
	text: {
		readme?: htmlString;
		comment?: htmlString;
	};
	sources?: YafDeclarationReflection['sources'];
	implementedBy?: YafDeclarationReflection['implementedBy'];
}
export interface YafParameterReflection extends JSONOutput.ParameterReflection {
	text: {
		readme?: htmlString;
		comment?: htmlString;
	};
}
export interface YafTypeParameterReflection
	extends JSONOutput.TypeParameterReflection {
	text: {
		readme?: htmlString;
		comment?: htmlString;
	};
}

export type treeMenuRoot = {
	[key: number]: treeMenuBranch;
};
export type treeMenuBranch = {
	name: string;
	query: string;
	hash: string | '';
	kind: number;
	id: number;
	children: treeMenuRoot;
	parentDrawerElement?: HTMLElement;
	inheritedFrom?: string | undefined;
};

export type YAFReflectionLink = {
	name: string;
	fileName: string;
};
export type reflectionMap = {
	[key: number]: YAFReflectionLink;
};

export interface kindSymbol {
	className: string;
	symbol: string;
}
export type kindSymbols = { [key: number]: kindSymbol };

export type needsParenthesis = Record<string, Record<string, boolean>>;
