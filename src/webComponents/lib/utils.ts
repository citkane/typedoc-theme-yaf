import { TypeContext, YAFDataObject } from '../types';

export const wbr = (string: string) => {
	const pieces = string.split(/(?=_|-|[A-Z])/);
	return pieces.join('<wbr />');
};
export const renderTypeParametersSignature = (
	typeParameters: YAFDataObject['typeParameters']
) => {
	if (!typeParameters || !typeParameters.length) return '';
	const params = typeParameters.map((param) => {
		const span = `<span class="type${
			param.kindString ? ` ${param.kindString}` : ''
		}">${param.name}</span>`;

		return param.varianceModifier
			? `<span class="modifier">${param.varianceModifier}</span>${span}`
			: span;
	});

	return `<span class="symbol"><</span>${params.join(
		', '
	)}<span class="symbol">></span>`;
};
export const needsParenthesis = {
	array: () => {
		return false;
	},
	conditional: (context: TypeContext) => {
		const map: Record<TypeContext, boolean> = {
			none: false,
			templateLiteralElement: false,
			arrayElement: true,
			indexedAccessElement: false,
			conditionalCheck: true,
			conditionalExtends: true,
			conditionalTrue: false,
			conditionalFalse: false,
			indexedIndex: false,
			indexedObject: true,
			inferredConstraint: true,
			intersectionElement: true,
			mappedName: false,
			mappedParameter: false,
			mappedTemplate: false,
			optionalElement: true,
			predicateTarget: false,
			queryTypeTarget: false,
			typeOperatorTarget: true,
			referenceTypeArgument: false,
			restElement: true,
			tupleElement: false,
			unionElement: true,
		};

		return map[context];
	},
	indexedAccess: () => {
		return false;
	},
	inferred: (context: TypeContext) => {
		const map: Record<TypeContext, boolean> = {
			none: false,
			templateLiteralElement: false,
			arrayElement: true,
			indexedAccessElement: false,
			conditionalCheck: false,
			conditionalExtends: false,
			conditionalTrue: false,
			conditionalFalse: false,
			indexedIndex: false,
			indexedObject: true,
			inferredConstraint: false,
			intersectionElement: false,
			mappedName: false,
			mappedParameter: false,
			mappedTemplate: false,
			optionalElement: true,
			predicateTarget: false,
			queryTypeTarget: false,
			typeOperatorTarget: false,
			referenceTypeArgument: false,
			restElement: true,
			tupleElement: false,
			unionElement: false,
		};

		return map[context];
	},
	intersection: (context: TypeContext) => {
		const map: Record<TypeContext, boolean> = {
			none: false,
			templateLiteralElement: false,
			arrayElement: true,
			indexedAccessElement: false,
			conditionalCheck: true,
			conditionalExtends: false,
			conditionalTrue: false,
			conditionalFalse: false,
			indexedIndex: false,
			indexedObject: true,
			inferredConstraint: false,
			intersectionElement: false,
			mappedName: false,
			mappedParameter: false,
			mappedTemplate: false,
			optionalElement: true,
			predicateTarget: false,
			queryTypeTarget: false,
			typeOperatorTarget: true,
			referenceTypeArgument: false,
			restElement: true,
			tupleElement: false,
			unionElement: false,
		};

		return map[context];
	},
	intrinsic: () => {
		return false;
	},
	literal: () => {
		return false;
	},
	mapped: () => {
		return false;
	},
	'named-tuple-member': () => {
		return false;
	},
	optional: () => {
		return false;
	},
	predicate: () => {
		return false;
	},
	query: () => {
		return false;
	},
	reference: () => {
		return false;
	},
	reflection: () => {
		return false;
	},
	rest: () => {
		return false;
	},
	'template-literal': () => {
		return false;
	},
	tuple: () => {
		return false;
	},
	typeOperator: (context: TypeContext) => {
		const map: Record<TypeContext, boolean> = {
			none: false,
			templateLiteralElement: false,
			arrayElement: true,
			indexedAccessElement: false,
			conditionalCheck: false,
			conditionalExtends: false,
			conditionalTrue: false,
			conditionalFalse: false,
			indexedIndex: false,
			indexedObject: true,
			inferredConstraint: false,
			intersectionElement: false,
			mappedName: false,
			mappedParameter: false,
			mappedTemplate: false,
			optionalElement: true,
			predicateTarget: false,
			queryTypeTarget: false,
			typeOperatorTarget: false,
			referenceTypeArgument: false,
			restElement: false,
			tupleElement: false,
			unionElement: false,
		};

		return map[context];
	},
	union: (context: TypeContext) => {
		const map: Record<TypeContext, boolean> = {
			none: false,
			templateLiteralElement: false,
			arrayElement: true,
			indexedAccessElement: false,
			conditionalCheck: true,
			conditionalExtends: false,
			conditionalTrue: false,
			conditionalFalse: false,
			indexedIndex: false,
			indexedObject: true,
			inferredConstraint: false,
			intersectionElement: true,
			mappedName: false,
			mappedParameter: false,
			mappedTemplate: false,
			optionalElement: true,
			predicateTarget: false,
			queryTypeTarget: false,
			typeOperatorTarget: true,
			referenceTypeArgument: false,
			restElement: false,
			tupleElement: false,
			unionElement: false,
		};

		return map[context];
	},
	unknown: (context: TypeContext) => {
		return context !== 'none';
	},
};
