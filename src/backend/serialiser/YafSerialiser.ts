import { DeclarationHierarchy } from 'typedoc';
import {
	CommentDisplayPart,
	DeclarationReflection,
	DefaultThemeRenderContext,
	ReflectionKind,
	ReflectionType,
} from 'typedoc';

import { dataLocation, serialiserReflection } from '../../types/backendTypes';
import {
	hierarchy,
	htmlString,
	YAFDataObject,
	YafDeclarationReflection,
	YafParameterReflection,
	YafSignatureReflection,
} from '../../types/types';
import {
	mutateFixDeclarationReflections,
	fixDeclarationSignatures,
	mutateFixReflectionGroups,
} from './fixers';

export class YafSerialiser {
	dataObjectArray: YAFDataObject[];
	private dataObject: YAFDataObject;
	private context: DefaultThemeRenderContext;
	private reflection: serialiserReflection;

	constructor(
		object: YAFDataObject,
		reflection: serialiserReflection,
		context: DefaultThemeRenderContext
	) {
		this.context = context;
		this.dataObject = this.parseReflectionToYafDataObject(
			object,
			reflection
		);
		this.dataObjectArray = this.parseDataObjectToArray(this.dataObject);
		this.reflection = reflection;
	}

	parseReflectionToYafDataObject = (
		object: YAFDataObject,
		reflection: serialiserReflection,
		hashPrefix?: string,
		rootReflection?: serialiserReflection
	) => {
		object = this.serializeYafDataObject(
			object,
			reflection,
			rootReflection,
			hashPrefix
		);

		if (reflection.type instanceof ReflectionType) {
			if (
				!rootReflection &&
				reflection.parent.kind === ReflectionKind.Class
			)
				rootReflection = reflection.parent;
			mutateFixDeclarationReflections(
				object as YafDeclarationReflection,
				reflection,
				this,
				rootReflection
			);
			mutateFixReflectionGroups(object);
		}
		if (reflection.signatures)
			object.signatures = fixDeclarationSignatures(
				object,
				reflection,
				this
			);
		if (object.groups) {
			object.groups.forEach((group) => {
				group.children = group.children?.filter(
					(id) => !!object.children?.find((child) => child.id === id)
				);
			});
		}

		object.children?.forEach((objectChild) => {
			const reflectionChild = reflection.children?.find(
				(reflectionChild) => reflectionChild.id === objectChild.id
			);
			this.parseReflectionToYafDataObject(
				objectChild as YAFDataObject,
				reflectionChild
			);
		});

		return object as YAFDataObject;
	};

	private serializeYafDataObject = (
		object: YAFDataObject,
		reflection: serialiserReflection,
		rootReflection?: serialiserReflection,
		hashPrefix?: string
	) => {
		['is', 'location', 'text'].forEach(
			(key) => !object[key] && (object[key] = {})
		);

		const parentRefelection = rootReflection || reflection.parent;
		const { hash, query } = YafSerialiser.serialiseReflectionLocation(
			reflection,
			hashPrefix,
			parentRefelection
		);

		object.parentId =
			parentRefelection && parentRefelection.id
				? parentRefelection.id
				: undefined;
		object.is.declaration = reflection instanceof DeclarationReflection;
		object.location.query = query;
		object.location.hash = hash;
		if (reflection.version) object.version = reflection.version;
		object.flags = YafSerialiser.extendDefaultFlags(object);
		if (reflection.typeHierarchy)
			object.hierarchy = this.serialiseHierarchy(
				reflection.typeHierarchy
			);
		this.mutateComment(object);
		if (reflection.readme) this.mutateReadme(object, reflection);
		if (object.getSignature) this.mutateComment(object.getSignature);
		if (object.setSignature) this.mutateComment(object.setSignature);

		return object;
	};

	/**
	 * Formats data regarding the intended URL location of the reflection data.
	 * @param reflection
	 * @returns a data object which will extend the typedoc `JSONOutput` reflection
	 */
	private static serialiseReflectionLocation = (
		reflection: serialiserReflection,
		hashPrefix: string | undefined,
		rootReflection: serialiserReflection
	): dataLocation => {
		if (!rootReflection) return { hash: '', query: 'index' };

		const locationArray = `${rootReflection.getFriendlyFullName()}.${
			reflection.name
		}`.split('.');
		const hash = !YafSerialiser.isPage(reflection.kind)
			? locationArray.pop()
			: '';
		const kindId = hash ? rootReflection.kind : reflection.kind;
		const kind = ReflectionKind[kindId];

		locationArray.splice(locationArray.length - 1, 0, kind);
		const query = locationArray.join('.');

		return {
			hash: hashPrefix ? `${hashPrefix}.${hash}` : hash,
			query,
		};
	};

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
			YafSerialiser.isPage(child.kind)
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

	private serialiseHierarchy = (
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
				hierachyItem.children = this.serialiseHierarchy(hierachy.next);

			parsedHierarchy.push(hierachyItem);
		});

		return parsedHierarchy;
	};
	private mutateReadme = (
		object: YAFDataObject,
		reflection: serialiserReflection
	) => {
		if (!object.text) object.text = {};
		if (reflection.readme) {
			object.text.readme = this.context.markdown(
				reflection.readme
			) as htmlString;
		}
	};
	private mutateComment = (
		object:
			| YAFDataObject
			| YafSignatureReflection
			| YafParameterReflection
			| YafDeclarationReflection
	) => {
		if (!object.text) object.text = {};

		if (YafSerialiser.hasVisibleComponent(object) && !!object.comment) {
			object.text.comment = this.context.markdown(
				object.comment.summary.map((part) => {
					if ('tag' in part && part.tag === '@link')
						return {
							kind: 'text',
							text: `[${part.text}](${part.target})`,
						};
					return part;
				}) as CommentDisplayPart[]
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
		const parameters = (<YafSignatureReflection>object).parameters;
		if (parameters)
			parameters.forEach((parameter) => this.mutateComment(parameter));
	};

	static extendDefaultFlags = (reflectionObject: YAFDataObject) => {
		const { flags } = reflectionObject;
		if (
			reflectionObject.inheritedFrom &&
			ReflectionKind[reflectionObject.kind] !== 'Constructor'
		)
			flags['isInherited'] = true;

		return flags;
	};

	private static isPage = (kind: number) => {
		return YafSerialiser.hasOwnPage.indexOf(kind) > -1;
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
}
