import {
	CommentDisplayPart,
	DeclarationReflection,
	DefaultThemeRenderContext,
	ProjectReflection,
	ReflectionKind,
	ReflectionType,
} from 'typedoc';
import { htmlString, YAFDataObject } from '../types.js';
import { formatReflectionLocation } from './lib.js';

/**
 * Extends the existing typedoc serialization between a `Reflection` and a serialized `JSONOutput.Reflection`.
 * @param object
 * @param reflection
 * @param context
 * @returns the extended data object
 */
export const serialize = (
	object: YAFDataObject,
	reflection: ProjectReflection & DeclarationReflection,
	context: DefaultThemeRenderContext
) => {
	const { hash, query, isLeaf } = formatReflectionLocation(reflection);

	object.is.leaf = isLeaf;
	object.is.project = reflection.isProject();
	object.is.declaration = reflection instanceof DeclarationReflection;

	object.is.memberDeclaration =
		[ReflectionKind.TypeAlias, ReflectionKind.Variable].includes(
			reflection.kind
		) && reflection instanceof DeclarationReflection;

	object.is.reflection = reflection.type instanceof ReflectionType;
	object.location.query = query;
	object.location.hash = hash;

	object.version = reflection.version;

	if (reflection.readme) {
		object.text.readme = context.markdown(reflection.readme) as htmlString;
	}
	if (reflection.hasComment()) {
		object.text.comment = context.markdown(
			object.comment.summary as readonly CommentDisplayPart[]
		) as htmlString;
	}
	return object;
};
