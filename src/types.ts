/**
 * @module types/backend
 */
import { JSONOutput, ProjectReflection, Reflection } from 'typedoc';

export interface YAFDataReflection extends Reflection {
	readme?: ProjectReflection['readme'];
}

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

export type YAFReflectionLink = {
	name: string;
	fileName: string;
	level: number;
};
export type abnormalSigTypes =
	| { type: 'named-tuple-member' }
	| { type: 'template-literal' };

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
};
export type dataLocation = {
	hash: string;
	query: string;
	isLeaf: boolean;
};
export type htmlString = `<${string}>${string}</${string}>` | `<${string} />`;

export type reflectionMap = {
	[key: number]: YAFReflectionLink;
};

export interface highlighter {
	toHtml: (hast: object) => htmlString;
	flagToScope: (lang: string) => string;
	highlight: (text: string, scope: string) => object;
}

export type anyObject = Record<string | number | symbol, any>;
/*
export declare const TypeContext: {
	readonly none: 'none';
	readonly templateLiteralElement: 'templateLiteralElement';
	readonly arrayElement: 'arrayElement';
	readonly indexedAccessElement: 'indexedAccessElement';
	readonly conditionalCheck: 'conditionalCheck';
	readonly conditionalExtends: 'conditionalExtends';
	readonly conditionalTrue: 'conditionalTrue';
	readonly conditionalFalse: 'conditionalFalse';
	readonly indexedIndex: 'indexedIndex';
	readonly indexedObject: 'indexedObject';
	readonly inferredConstraint: 'inferredConstraint';
	readonly intersectionElement: 'intersectionElement';
	readonly mappedName: 'mappedName';
	readonly mappedParameter: 'mappedParameter';
	readonly mappedTemplate: 'mappedTemplate';
	readonly optionalElement: 'optionalElement';
	readonly predicateTarget: 'predicateTarget';
	readonly queryTypeTarget: 'queryTypeTarget';
	readonly typeOperatorTarget: 'typeOperatorTarget';
	readonly referenceTypeArgument: 'referenceTypeArgument';
	readonly restElement: 'restElement';
	readonly tupleElement: 'tupleElement';
	readonly unionElement: 'unionElement';
};
export declare type TypeContext = typeof TypeContext[keyof typeof TypeContext];
*/
export interface kindSymbol {
	className: string;
	symbol: string;
}

export type kindSymbols = { [key: number]: kindSymbol };
