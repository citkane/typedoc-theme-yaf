/**
 * @module preprocessor/types
 */
import { JSONOutput } from 'typedoc';

export type allTypes = JSONOutput.ArrayType &
	JSONOutput.ConditionalType &
	JSONOutput.IndexedAccessType &
	JSONOutput.InferredType &
	JSONOutput.IntersectionType &
	JSONOutput.IntrinsicType &
	JSONOutput.OptionalType &
	JSONOutput.PredicateType &
	JSONOutput.QueryType &
	JSONOutput.ReferenceType &
	JSONOutput.ReflectionType &
	JSONOutput.RestType &
	JSONOutput.LiteralType &
	JSONOutput.TupleType &
	JSONOutput.NamedTupleMemberType &
	JSONOutput.TemplateLiteralType &
	JSONOutput.MappedType &
	JSONOutput.TypeOperatorType &
	JSONOutput.UnionType &
	JSONOutput.UnknownType;

type YAFDataExtension = {
	version: string;
	children?: YAFDataObject[];
	is: {
		leaf: boolean;
		project: boolean;
		declaration: boolean;
		memberDeclaration: boolean;
		reflection: boolean;
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
	};
};
export type YAFDataObject = YAFDataExtension &
	JSONOutput.DeclarationReflection &
	JSONOutput.ProjectReflection &
	JSONOutput.ContainerReflection;

export type treeMenuRoot = {
	[key: number]: treeMenuBranch;
};
export type treeMenuBranch = {
	name: string;
	query: string;
	hash: string | '';
	children: treeMenuRoot;
};
export type dataLocation = {
	hash: string;
	query: string;
	isLeaf: boolean;
};
export type htmlString = `<${string}>${string}</${string}>` | `<${string} />`;

export type reflectionMap = {
	[key: number]: { fileName: string; level: number };
};

export interface highlighter {
	toHtml: (hast: object) => htmlString;
	flagToScope: (lang: string) => string;
	highlight: (text: string, scope: string) => object;
}
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
