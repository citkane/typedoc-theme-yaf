import { DeclarationHierarchy, ReferenceType } from 'typedoc';
import { Serializer } from 'typedoc';
import {
	CommentDisplayPart,
	DeclarationReflection,
	DefaultThemeRenderContext,
	ProjectReflection,
	ReferenceReflection,
	ReflectionKind,
	ReflectionType,
} from 'typedoc';
import { dataLocation } from '../types/backendTypes';
import {
	hierarchy,
	htmlString,
	YAFDataObject,
	YafDeclarationReflection,
	YafParameterReflection,
	YafSignatureReflection,
} from '../types/types';

export class YafSerializer {
	private dataObject: YAFDataObject;
	dataObjectArray: YAFDataObject[];
	private context: DefaultThemeRenderContext;
	/**
	 * The kinds of reflections which will generate their own document page in the front-end.
	 */
	private static hasOwnPage = [
		ReflectionKind.Class,
		ReflectionKind.Interface,
		ReflectionKind.Enum,
		ReflectionKind.Namespace,
		ReflectionKind.Module,
		ReflectionKind.TypeAlias,
		ReflectionKind.Function,
		ReflectionKind.Variable,
	];

	constructor(
		object: YAFDataObject,
		reflection: ProjectReflection & DeclarationReflection,
		context: DefaultThemeRenderContext
	) {
		this.context = context;
		this.dataObject = this.parseProjectToObject(object, reflection);
		this.dataObjectArray = this.parseDataObjectToArray(this.dataObject);
	}
	/**
	 * Flattens the extended JSONOutput project into an array of reflections.
	 * @param objects
	 * @param object
	 * @returns an array of extended JSONOutput reflections
	 */
	private parseDataObjectToArray = (
		object: YAFDataObject,
		objects: YAFDataObject[] = []
	) => {
		const thisChildren: YAFDataObject[] = [];
		const newPages: YAFDataObject[] = [];
		object.children?.forEach((child: YAFDataObject) => {
			YafSerializer.isPage(child.kind)
				? newPages.push(child)
				: thisChildren.push(child);
		});
		object.children = thisChildren;
		objects.push(object);
		newPages.forEach((child) => {
			this.parseDataObjectToArray(child, objects);
		});
		return objects;
	};
	private parseProjectToObject = (
		object: YAFDataObject,
		reflection: ProjectReflection & DeclarationReflection
	) => {
		if (object.groups) {
			object.groups.forEach((group) => {
				group.children = group.children.filter(
					(id) => !!object.children.find((child) => child.id === id)
				);
			});
		}
		object = this.serialize(object, reflection);
		object.children?.forEach((objectChild) => {
			const reflectionChild = reflection.children.find(
				(rc) => rc.id === objectChild.id
			);
			this.parseProjectToObject(
				objectChild as YAFDataObject,
				reflectionChild as ProjectReflection & DeclarationReflection
			);
		});

		return object as YAFDataObject;
	};
	private serialize = (
		object: YAFDataObject,
		reflection: ProjectReflection & DeclarationReflection
	) => {
		['is', 'location', 'text', 'has'].forEach(
			(key) => !object[key] && (object[key] = {})
		);

		const { hash, query } =
			YafSerializer.formatReflectionLocation(reflection);

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
		object.flags = YafSerializer.extendDefaultFlags(object);
		object.hierarchy = this.parseHierarchy(reflection.typeHierarchy);
		object.signatures?.forEach(
			(signature) =>
				(signature.flags = YafSerializer.extendDefaultFlags(signature))
		);

		if (reflection.readme) this.parseReadme(object, reflection);
		this.parseComment(object);

		if (object.getSignature) this.parseComment(object.getSignature);
		if (object.setSignature) this.parseComment(object.setSignature);

		return object;
	};

	private parseHierarchy = (
		hierachy: DeclarationHierarchy | undefined
	): YAFDataObject['hierarchy'] => {
		if (!hierachy) return undefined;

		const parsedHierarchy: hierarchy[] = [];
		hierachy.types.forEach((type, i, l) => {
			const hierachyItem: hierarchy = {
				name: type.toString(),
				isTarget: hierachy.isTarget,
				linkId:
					typeof type['_target'] === 'number'
						? String(type['_target'])
						: undefined,
			};
			if (i === l.length - 1 && !!hierachy.next)
				hierachyItem.children = this.parseHierarchy(hierachy.next);

			parsedHierarchy.push(hierachyItem);
		});

		return parsedHierarchy;
	};
	private parseReadme = (
		object: YAFDataObject,
		reflection: ProjectReflection | DeclarationReflection
	) => {
		if (!object.text) object.text = {};
		if (reflection.readme) {
			object.text.readme = this.context.markdown(
				reflection.readme
			) as htmlString;
		}
	};
	private parseComment = (
		object:
			| YAFDataObject
			| YafSignatureReflection
			| YafParameterReflection
			| YafDeclarationReflection
	) => {
		if (!object.text) object.text = {};

		if (YafSerializer.hasVisibleComponent(object)) {
			object.text.comment = this.context.markdown(
				object.comment.summary as CommentDisplayPart[]
			) as htmlString;
			object.comment.blockTags?.forEach((tag) => {
				const tagString =
					tag.tag.charAt(1).toLocaleUpperCase() +
					tag.tag.substring(2).toLocaleLowerCase();

				object.text.comment += `<h5>${tagString}:</h5>`;
				object.text.comment += this.context.markdown(
					tag.content as CommentDisplayPart[]
				);
			});
		}

		if ((<YAFDataObject>object).signatures)
			(<YAFDataObject>object).signatures.forEach((signature) =>
				this.parseComment(signature)
			);

		if ((<YafDeclarationReflection>object).type?.declaration)
			(<YafDeclarationReflection>(
				object
			)).type.declaration.children?.forEach((parameter) =>
				this.parseComment(parameter as YafDeclarationReflection)
			);

		if ((<YafSignatureReflection>object).parameters)
			(<YafSignatureReflection>object).parameters.forEach((parameter) =>
				this.parseComment(parameter)
			);
	};

	/**
	 * Formats data regarding the intended URL location of the reflection data.
	 * @param reflection
	 * @returns a data object which will extend the typedoc `JSONOutput` reflection
	 */
	static formatReflectionLocation = (
		reflection: DeclarationReflection
	): dataLocation => {
		let hash = '';
		const locationArray = reflection.getFriendlyFullName().split('.');
		if (!YafSerializer.isPage(reflection.kind) && locationArray.length)
			hash = locationArray.pop();

		if (reflection.parent) {
			locationArray.splice(
				locationArray.length - 1,
				0,
				ReflectionKind[
					!hash ? reflection.kind : reflection.parent.kind
				].toLowerCase()
			);
		}
		const query = locationArray.join('.');
		return {
			hash,
			query,
		};
	};
	static extendDefaultFlags = (
		reflection:
			| DeclarationReflection
			| YafSignatureReflection
			| YAFDataObject
	) => {
		const flags = (<DeclarationReflection>reflection).flags.toObject
			? (<DeclarationReflection>reflection).flags.toObject()
			: reflection.flags;
		if (
			reflection.inheritedFrom &&
			ReflectionKind[reflection.kind] !== 'Constructor'
		)
			flags['isInherited'] = true;

		return flags;
	};
	private static isPage = (kind: number) => {
		return YafSerializer.hasOwnPage.indexOf(kind) > -1;
	};
	private static hasVisibleComponent = (
		object: YAFDataObject | YafSignatureReflection | YafParameterReflection
	) => {
		return (
			object.comment &&
			(object.comment.summary.some(
				(item) => item.kind !== 'text' || item.text !== ''
			) ||
				(object.comment.blockTags &&
					object.comment.blockTags.length > 0))
		);
	};
}
