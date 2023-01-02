import { DeclarationHierarchy, JSONOutput, Serializer } from 'typedoc';
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
	dataObjectArray: YAFDataObject[];
	private dataObject: YAFDataObject;
	private context: DefaultThemeRenderContext;
	private reflection: ProjectReflection & DeclarationReflection;
	private tdocSerializer: Serializer;

	constructor(
		object: YAFDataObject,
		reflection: ProjectReflection & DeclarationReflection,
		context: DefaultThemeRenderContext,
		tdocSerializer: Serializer
	) {
		this.context = context;
		this.dataObject = this.parseProjectToObject(object, reflection);
		this.dataObjectArray = this.parseDataObjectToArray(this.dataObject);
		this.reflection = reflection;
		this.tdocSerializer = tdocSerializer;
	}

	private parseProjectToObject = (
		object: YAFDataObject,
		reflection: ProjectReflection & DeclarationReflection
	) => {
		object = this.serialize(object, reflection);

		this.fixDeclarationReflections(object, reflection);

		if (reflection.type instanceof ReflectionType) {
			const children =
				(<JSONOutput.ReflectionType>object.type)?.declaration
					?.children || [];
		}

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

		if (YafSerializer.hasVisibleComponent(object) && !!object.comment) {
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

		const signatures = (<YAFDataObject>object).signatures;
		const declaration =
			this.reflection && this.reflection.type instanceof ReflectionType
				? this.reflection.type.declaration
				: undefined;
		const children = declaration ? declaration.children : undefined;
		const parameters = (<YafSignatureReflection>object).parameters;

		if (signatures)
			signatures.forEach((signature) => this.parseComment(signature));

		if (children)
			children?.forEach((child) => {
				this.parseComment(child as unknown as YafDeclarationReflection);
			});

		if (parameters)
			parameters.forEach((parameter) => this.parseComment(parameter));

		if (declaration) {
			this.parseComment(
				declaration as unknown as YafDeclarationReflection
			);
		}
	};

	/**
	 * Formats data regarding the intended URL location of the reflection data.
	 * @param reflection
	 * @returns a data object which will extend the typedoc `JSONOutput` reflection
	 */
	static formatReflectionLocation = (
		reflection: DeclarationReflection,
		isDeclarationChild = false
	): dataLocation => {
		let hash = '';
		const locationArray = isDeclarationChild
			? `${reflection.parent!.getFriendlyFullName()}.${
					reflection.name
			  }`.split('.')
			: reflection.getFriendlyFullName().split('.');

		if (!YafSerializer.isPage(reflection.kind) && locationArray.length)
			hash = locationArray.pop() || '';

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
		const flags =
			'toObject' in reflection.flags
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

	private fixDeclarationReflections = (
		object: YAFDataObject,
		reflection: DeclarationReflection
	) => {
		const declaration =
			reflection.type instanceof ReflectionType
				? reflection.type.declaration
				: undefined;
		if (!declaration) return;

		const objectDeclaration = (<JSONOutput.ReflectionType>object.type)
			.declaration;
		objectDeclaration!.name = reflection.name;

		objectDeclaration!.signatures?.forEach(
			(signature) => (signature.name = reflection.name)
		);

		if (objectDeclaration!.children && declaration.children)
			objectDeclaration!.children?.forEach((objectChild, i) => {
				const fixedChild = YafSerializer.fixedReflectionChild(
					declaration.children![i],
					reflection
				);
				objectChild.name = fixedChild.name;
				objectChild.kind = fixedChild.kind;
				objectChild.kindString = fixedChild.kindString;

				this.fixDeclarationReflections(
					objectChild as YAFDataObject,
					fixedChild
				);
			});
		YafSerializer.fixReflectionGroups(object);
	};
	private static fixReflectionGroups = (object: YAFDataObject) => {
		if (
			!object.type ||
			!('declaration' in object.type) ||
			!object.type.declaration!.groups
		)
			return;
		const groups = object.type.declaration!.groups;
		const children = object.type.declaration!.children;

		const propertyGroup = groups.find(
			(group) => group.title === 'Properties'
		);
		let methodGroup = groups.find((group) => group.title === 'Methods');
		const getMethodGroup = () => {
			if (methodGroup) return methodGroup;
			methodGroup = {
				title: 'Methods',
				children: [],
			} as JSONOutput.ReflectionGroup;
			groups.push(methodGroup);
			return methodGroup;
		};

		if (propertyGroup)
			propertyGroup.children = propertyGroup.children?.filter((id) => {
				const child = children?.find((child) => child.id === id);
				if (child && child.kind === ReflectionKind.CallSignature) {
					methodGroup = getMethodGroup();
					methodGroup.children?.push(id);
					return false;
				}
				return true;
			});
		object.type.declaration!.groups = groups.filter(
			(group) => group.children?.length
		);
	};
	static fixedReflectionChild = (
		child: DeclarationReflection,
		parent: DeclarationReflection
	) => {
		const childClone = new DeclarationReflection(
			child.name,
			this.getCallSignatureKind(child),
			parent
		);
		Object.keys(child).forEach((key) => {
			if (['name', 'kind', 'parent', 'kindString'].includes(key)) return;

			if (Object.prototype.hasOwnProperty.call(child, key))
				childClone[key] = child[key];
		});
		childClone.kindString = this.getKindString(childClone.kind);
		return childClone;
	};
	private static getCallSignatureKind = (
		reflection: DeclarationReflection
	) => {
		const type = reflection.type as ReflectionType;
		const signatures = type?.declaration?.signatures;

		if (!signatures || signatures.length !== 1) return reflection.kind;
		return signatures[0].kind;
	};

	private static getKindString = (kind: ReflectionKind) => {
		let str = ReflectionKind[kind];
		str = str.replace(
			/(.)([A-Z])/g,
			(_m, a, b) => a + ' ' + b.toLowerCase()
		);
		return str;
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
