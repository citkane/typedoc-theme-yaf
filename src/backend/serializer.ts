import {
	CommentDisplayPart,
	DeclarationReflection,
	DefaultThemeRenderContext,
	ProjectReflection,
	ReferenceReflection,
	ReflectionKind,
	ReflectionType,
} from 'typedoc';
import {
	htmlString,
	YAFDataObject,
	YafDeclarationReflection,
	YafParameterReflection,
	YafSignatureReflection,
} from '../types/types';
import { formatReflectionLocation } from './lib';

/**
 * Extends the existing typedoc serialization between a `Reflection` and a serialized `JSONOutput.Reflection`.
 * @param object
 * @param reflection
 * @param context
 * @returns the extended data object
 * @category test category
 */
export const serialize = (
	object: YAFDataObject,
	reflection: ProjectReflection & DeclarationReflection,
	context: DefaultThemeRenderContext
) => {
	['is', 'location', 'text', 'has'].forEach(
		(key) => !object[key] && (object[key] = {})
	);

	const { hash, query, isLeaf } = formatReflectionLocation(reflection);

	object.is.leaf = isLeaf;
	object.is.project = reflection.isProject();
	object.is.declaration = reflection instanceof DeclarationReflection;
	object.is.reflection = reflection.type instanceof ReflectionType;
	object.is.referenceReflection =
		reflection.type instanceof ReferenceReflection;
	object.is.memberDeclaration =
		[ReflectionKind.TypeAlias, ReflectionKind.Variable].includes(
			reflection.kind
		) && reflection instanceof DeclarationReflection;

	object.has.getterOrSetter = reflection.hasGetterOrSetter();

	object.location.query = query;
	object.location.hash = hash;

	object.version = reflection.version;

	if (reflection.readme) parseReadme(object, reflection, context);
	parseComment(object, context);

	if (object.getSignature) parseComment(object.getSignature, context);
	if (object.setSignature) parseComment(object.setSignature, context);

	if (object.name === 'anInternalFunction') {
		console.log(reflection.comment);
	}

	return object;
};

const parseReadme = (
	object: YAFDataObject,
	reflection: ProjectReflection | DeclarationReflection,
	context: DefaultThemeRenderContext
) => {
	if (!object.text) object.text = {};
	if (reflection.readme) {
		object.text.readme = context.markdown(reflection.readme) as htmlString;
	}
};
const parseComment = (
	object:
		| YAFDataObject
		| YafSignatureReflection
		| YafParameterReflection
		| YafDeclarationReflection,
	context: DefaultThemeRenderContext
) => {
	if (!object.text) object.text = {};

	if (hasVisibleComponent(object)) {
		object.text.comment = context.markdown(
			object.comment.summary as CommentDisplayPart[]
		) as htmlString;
		object.comment.blockTags?.forEach((tag) => {
			const tagString =
				tag.tag.charAt(1).toLocaleUpperCase() +
				tag.tag.substring(2).toLocaleLowerCase();

			object.text.comment += `<h5>${tagString}:</h5>`;
			object.text.comment += context.markdown(
				tag.content as CommentDisplayPart[]
			);
		});
	}

	if ((<YAFDataObject>object).signatures)
		(<YAFDataObject>object).signatures.forEach((signature) =>
			parseComment(signature, context)
		);

	if ((<YafDeclarationReflection>object).type?.declaration)
		(<YafDeclarationReflection>object).type.declaration.children?.forEach(
			(parameter) =>
				parseComment(parameter as YafDeclarationReflection, context)
		);

	if ((<YafSignatureReflection>object).parameters)
		(<YafSignatureReflection>object).parameters.forEach((parameter) =>
			parseComment(parameter, context)
		);
};

const hasVisibleComponent = (
	object: YAFDataObject | YafSignatureReflection | YafParameterReflection
) => {
	return (
		object.comment &&
		(object.comment.summary.some(
			(item) => item.kind !== 'text' || item.text !== ''
		) ||
			object.comment.blockTags.length > 0)
	);
};
