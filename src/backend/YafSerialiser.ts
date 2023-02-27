import {
	DeclarationHierarchy,
	JSONOutput,
	ProjectReflection,
	ReferenceType,
	SignatureReflection,
	SomeType,
} from 'typedoc';
import {
	CommentDisplayPart,
	DeclarationReflection,
	DefaultThemeRenderContext,
	ReflectionKind,
} from 'typedoc';

import { dataLocation, serialiserReflection } from '../types/backendTypes';
import {
	hierarchy,
	htmlString,
	YAFDataObject,
	YafDeclarationReflection,
	YafParameterReflection,
	YafSignatureReflection,
} from '../types/types';

/**
 * Serialises the standard TypeDoc data output into `typedoc-theme-yaf` frontend compatible data.
 */
export class YafSerialiser {
	/**
	 * An array of serialised data objects, each of which is the data for a page in the documentation frontend.
	 */
	dataObjectArray: YAFDataObject[];
	/**
	 *
	 * @param object The TypeDoc JSONOutput.ProjectReflection before it gets serialised.
	 * @param reflection The Typedoc ProjectReflection.
	 * @param context The `typedoc-theme-yaf` modified render context.
	 */
	constructor(
		object: JSONOutput.ProjectReflection,
		reflection: ProjectReflection,
		context: DefaultThemeRenderContext
	) {
		const { parseDataObjectToArray, parseReflectionToYafDataObject } =
			YafSerialiser.parserFactory;
		const { fixMutateSignatureLinks } = YafSerialiser.fixerFactory;

		const dataObject = parseReflectionToYafDataObject(
			object as YAFDataObject,
			reflection,
			context,
			this
		);
		this.dataObjectArray = parseDataObjectToArray(dataObject);
		this.dataObjectArray.forEach((objectReflection) =>
			fixMutateSignatureLinks(this.dataObjectArray, objectReflection)
		);
	}

	/**
	 * A collection of static data serialiser methods
	 *
	 * @group Factories
	 */
	private static serialiseFactory = {
		/**
		 * Serialises a standard TypeDoc reflection into a `typedoc-theme-yaf` reflection
		 *
		 * @param object The standard TypeDoc JSONOutput object before it is serialised.
		 * @param reflection The unserialised TypeDoc `Reflection` object
		 * @param context
		 * @param rootReflection A standard TypeDoc `Reflection` for the top level of a page. It provides the context for child and signature reflections.
		 * @param hashPrefix Keeps track of the location hash as reflections recurse into children
		 * @returns
		 */
		serializeYafDataObject: (
			object: YAFDataObject,
			reflection: serialiserReflection,
			context: DefaultThemeRenderContext,
			rootReflection?: serialiserReflection,
			hashPrefix?: string
		) => {
			const { mutateComment, mutateReadme } = this.mutationFactory;
			const {
				serialiseHierarchy,
				serialiseReflectionLocation,
				extendDefaultFlags,
			} = this.serialiseFactory;

			const { fixObjectCallKind } = this.fixerFactory;

			['is', 'location', 'text'].forEach(
				(key) => !object[key] && (object[key] = {})
			);

			const parentReflection = rootReflection || reflection.parent;
			const { hash, query } = serialiseReflectionLocation(
				reflection,
				hashPrefix,
				parentReflection
			);

			object.sources = reflection.sources;
			object.parentId =
				parentReflection && parentReflection.id
					? parentReflection.id
					: undefined;
			object.is.declaration = reflection instanceof DeclarationReflection;
			object.location.query = query;
			object.location.hash = hash;
			if (reflection.version) object.version = reflection.version;
			object.flags = extendDefaultFlags(object);
			if (reflection.typeHierarchy)
				object.hierarchy = serialiseHierarchy(reflection.typeHierarchy);
			mutateComment(object, context);
			if (reflection.readme) mutateReadme(object, reflection, context);
			if (object.getSignature)
				mutateComment(object.getSignature, context);
			if (object.setSignature)
				mutateComment(object.setSignature, context);

			return fixObjectCallKind(object);
		},

		/**
		 * Formats data regarding the URL location of the reflection data.
		 * @param reflection
		 * @returns a data object which will extend the typedoc `JSONOutput` reflection
		 *
		 * @param reflection
		 * @param hashPrefix
		 * @param rootReflection
		 * @returns
		 */
		serialiseReflectionLocation: (
			reflection: serialiserReflection,
			hashPrefix: string | undefined,
			rootReflection: serialiserReflection
		): dataLocation => {
			if (!rootReflection) return { hash: '', query: 'index' };

			const isPage = this.utilities.isPage(reflection.kind);

			const locationString = isPage
				? reflection.getFriendlyFullName()
				: `${rootReflection.getFriendlyFullName()}.${reflection.name}`;

			const locationArray = locationString.split('.');
			const hash = !isPage ? locationArray.pop() : '';
			const kindId = hash ? rootReflection.kind : reflection.kind;
			const kind = ReflectionKind[kindId];

			locationArray.splice(locationArray.length - 1, 0, kind);
			const query = locationArray.join('.');

			return {
				hash: hashPrefix ? `${hashPrefix}.${hash}` : hash,
				query,
			};
		},
		/**
		 * Serialises the standard TypeDoc reflection hierarchy into a `typedoc-theme-yaf`
		 * compatible object.
		 *
		 * @param hierarchy
		 * @returns
		 */
		serialiseHierarchy: (
			hierarchy: DeclarationHierarchy | undefined
		): YAFDataObject['hierarchy'] => {
			if (!hierarchy) return undefined;

			const { serialiseHierarchy } = this.serialiseFactory;
			const parsedHierarchy: hierarchy[] = [];
			hierarchy.types.forEach((type, i, l) => {
				const hierarchyItem: hierarchy = {
					name: type.toString(),
					isTarget: hierarchy.isTarget,
					linkId:
						typeof type['_target'] === 'number'
							? String(type['_target'])
							: undefined,
				};
				if (i === l.length - 1 && !!hierarchy.next)
					hierarchyItem.children = serialiseHierarchy(hierarchy.next);

				parsedHierarchy.push(hierarchyItem);
			});

			return parsedHierarchy;
		},
		/**
		 * Adds a new `isInherited` flag to the standard TypeDoc flags.
		 * @param reflectionObject
		 * @returns
		 */
		extendDefaultFlags: (reflectionObject: YAFDataObject) => {
			const { flags } = reflectionObject;
			if (
				reflectionObject.inheritedFrom &&
				ReflectionKind[reflectionObject.kind] !== 'Constructor'
			) {
				flags['isInherited'] = true;
			}
			if (reflectionObject.overwrites) flags['isOverride'] = true;

			return flags;
		},
	};
	/**
	 * A collection of methods which perform data serialisations by means of data mutation for various good enough reasons.
	 *
	 * @group Factories
	 */
	private static mutationFactory = {
		/**
		 * Performs MarkDown parsing on a reflection readme.
		 *
		 * @param object
		 * @param reflection
		 * @param context
		 */
		mutateReadme: (
			object: YAFDataObject,
			reflection: serialiserReflection,
			context: DefaultThemeRenderContext
		) => {
			if (!object.text) object.text = {};
			if (reflection.readme) {
				object.text.readme = context.markdown(
					reflection.readme
				) as htmlString;
			}
		},
		/**
		 * Performs MarkDown parsing on a reflection comment.
		 *
		 * @param object
		 * @param context
		 */
		mutateComment: (
			object:
				| YAFDataObject
				| YafSignatureReflection
				| YafParameterReflection
				| YafDeclarationReflection,
			context: DefaultThemeRenderContext
		) => {
			const { mutateComment } = this.mutationFactory;
			const { hasVisibleTextComponent: hasVisibleComponent } =
				this.utilities;

			if (!object.text) object.text = {};

			if (hasVisibleComponent(object) && !!object.comment) {
				object.text.comment = context.markdown(
					mapComment(object.comment.summary as CommentDisplayPart[])
				) as htmlString;

				object.comment.blockTags?.forEach((tag) => {
					const tagString =
						tag.tag.charAt(1).toLocaleUpperCase() +
						tag.tag.substring(2).toLocaleLowerCase();

					object.text.comment += `<h5>${tagString}:</h5>`;
					object.text.comment += context.markdown(
						mapComment(tag.content as CommentDisplayPart[])
					);
				});
			}
			const parameters = (<YafSignatureReflection>object).parameters;
			if (parameters)
				parameters.forEach((parameter) =>
					mutateComment(parameter, context)
				);

			function mapComment(contentArray: CommentDisplayPart[]) {
				return contentArray.map((part) => {
					if ('tag' in part && part.tag === '@link') {
						return {
							kind: 'text',
							text: `[${part.text}](${part.target})`,
						};
					}
					return part;
				}) as CommentDisplayPart[];
			}
		},
	};
	/**
	 * A collection of high high level methods to parse the standard TypeDoc data into the desired `typedoc-theme-yaf` outputs.
	 *
	 * @group Factories
	 */
	private static parserFactory = {
		/**
		 * Parses the standard TypeDoc data output into a `typedoc-theme-yaf` serialised object.
		 * @param object
		 * @param reflection
		 * @param context
		 * @param serialiser
		 * @param hashPrefix
		 * @param rootReflection
		 * @returns
		 */
		parseReflectionToYafDataObject: (
			object: YAFDataObject,
			reflection: serialiserReflection,
			context: DefaultThemeRenderContext,
			serialiser: YafSerialiser,
			hashPrefix?: string,
			rootReflection?: serialiserReflection
		) => {
			const { serializeYafDataObject } = this.serialiseFactory;
			const { parseReflectionToYafDataObject } = this.parserFactory;
			const {
				fixMutateDeclarationReflections,
				fixMutateReflectionGroups,
				fixDeclarationSignatures,
			} = this.fixerFactory;

			object = serializeYafDataObject(
				object,
				reflection,
				context,
				rootReflection,
				hashPrefix
			);

			if (object.type && 'declaration' in object.type) {
				const parentKind = reflection.parent.kind;
				const { Class, Interface, ClassOrInterface } = ReflectionKind;
				if (
					!rootReflection &&
					[Class, Interface, ClassOrInterface].includes(parentKind)
				) {
					rootReflection = reflection.parent;
				}

				fixMutateDeclarationReflections(
					object as YafDeclarationReflection,
					reflection,
					serialiser,
					context,
					rootReflection
				);
				fixMutateReflectionGroups(object);
			}
			if (reflection.signatures) {
				object.signatures = fixDeclarationSignatures(
					object,
					reflection,
					serialiser,
					context,
					rootReflection
				);
			}
			if (object.groups) {
				object.groups.forEach((group) => {
					group.children = group.children?.filter(
						(id) =>
							!!object.children?.find((child) => child.id === id)
					);
				});
			}

			object.children?.forEach((objectChild) => {
				const reflectionChild = reflection.children?.find(
					(reflectionChild) => reflectionChild.id === objectChild.id
				);
				parseReflectionToYafDataObject(
					objectChild as YAFDataObject,
					reflectionChild,
					context,
					serialiser,
					object.location.hash,
					rootReflection
				);
			});

			return object as YAFDataObject;
		},

		/**
		 * Flattens the extended JSONOutput project into an array of reflections.
		 *
		 * @param projectArray
		 * @param object
		 * @returns an array of extended JSONOutput reflections
		 */
		parseDataObjectToArray: (
			object: YAFDataObject,
			projectArray: YAFDataObject[] = []
		) => {
			const { parseDataObjectToArray } = this.parserFactory;
			const { isPage } = this.utilities;
			const thisChildren: YAFDataObject[] = [];
			const newPages: YAFDataObject[] = [];
			object.children?.forEach((child: YAFDataObject) => {
				isPage(child.kind)
					? newPages.push(child)
					: thisChildren.push(child);
			});
			object.children = thisChildren;
			projectArray.push(object);
			newPages.forEach((child) => {
				parseDataObjectToArray(child, projectArray);
			});

			return projectArray;
		},
	};

	/**
	 * Ladies and Gents, hang onto your purses and wallets caus' the fixer is gonna fix your
	 * standard typeDoc JSON into a super recursive frontend object!!
	 *
	 * @group Factories
	 */
	private static fixerFactory = {
		/**
		 * The standard TypeDoc JSON signature output gets named as "__type".
		 *
		 * This function serialises the signature into the YAF frontend format with the corrected name.
		 *
		 * @param object
		 * @param reflection
		 * @param serializer
		 * @param context
		 * @param rootReflection
		 * @returns
		 */
		fixDeclarationSignatures: (
			object: YAFDataObject,
			reflection: serialiserReflection,
			serializer: YafSerialiser,
			context: DefaultThemeRenderContext,
			rootReflection: serialiserReflection
		) => {
			const { signatures: objectSignatures } = object;
			const { parseReflectionToYafDataObject } = this.parserFactory;
			const { extendDefaultFlags } = this.serialiseFactory;
			const { fixMutateSignatureReferences } = this.fixerFactory;

			if (!objectSignatures) return undefined;

			const fixedSignatures = objectSignatures?.map((objectSignature) => {
				objectSignature.name = object.name;

				const reflectionSignature = reflection.signatures?.find(
					(reflectionSignature) =>
						reflectionSignature.id == objectSignature.id
				);

				fixMutateSignatureReferences(
					objectSignature,
					reflectionSignature
				);

				objectSignature.flags = extendDefaultFlags(
					objectSignature as YAFDataObject
				);

				objectSignature = parseReflectionToYafDataObject(
					objectSignature as YAFDataObject,
					reflectionSignature,
					context,
					serializer,
					object.location.hash,
					rootReflection || reflection
				);
				return objectSignature;
			});

			return fixedSignatures;
		},
		/**
		 * The TypeDoc serialiser cannot track the id's of reflections across workspace packages in
		 * a [monorepo](https://typedoc.org/guides/monorepo/) entryPoint strategy.
		 *
		 * The result is that documentation cross linkages for parameter types are lost.
		 *
		 * This method examines the type reflection and adds a reference to the file context, which identifies the package.\
		 * `typedoc-theme-yaf` can the forensically find the target id when it later parses the links.
		 *
		 * @param objectSignature
		 * @param reflectionSignature
		 */
		fixMutateSignatureReferences: (
			objectSignature: YafSignatureReflection,
			reflectionSignature: SignatureReflection
		) => {
			reflectionSignature.parameters.forEach((reflectionParameter, i) => {
				const objectParameter = objectSignature.parameters[i];
				const { type: reflectionType } = reflectionParameter;
				const { type: objectType } = objectParameter;
				parseType(objectType, reflectionType);
			});
			if (reflectionSignature.type) {
				parseType(objectSignature.type, reflectionSignature.type);
			}
			function parseType(objectType, reflectionType) {
				if (reflectionType && 'types' in reflectionType) {
					const reflectionTypes = reflectionType.types;
					const objectTypes = objectType['types'];
					return reflectionTypes.forEach((reflectionType, i) => {
						const objectType = objectTypes[i];
						addFilePrefix(reflectionType, objectType);
					});
				}
				if (reflectionType && 'elementType' in reflectionType) {
					reflectionType = reflectionType.elementType;
					objectType = objectType['elementType'];
				}

				addFilePrefix(reflectionType, objectType);
			}
			function addFilePrefix(
				reflectionType: SomeType,
				objectType: JSONOutput.SomeType
			) {
				if (
					reflectionType &&
					reflectionType instanceof ReferenceType &&
					!reflectionType.package
				) {
					const filePrefix =
						!objectType['id'] && reflectionType['_target'].parent
							? reflectionType['_target'].parent?.name
									.replace(/"/g, '')
									.trim()
							: undefined;
					objectType['filePrefix'] = filePrefix;
				}
			}
		},
		/**
		 * Finds missing parameter links and fills in the target id.
		 *
		 * @param projectArray
		 * @param objectReflection
		 * @returns
		 */
		fixMutateSignatureLinks: (
			projectArray: YAFDataObject[],
			objectReflection: YAFDataObject
		) => {
			const { fixMutateSignatureLinks } = this.fixerFactory;

			objectReflection.signatures?.forEach((signature) => {
				signature.parameters?.forEach((parameter) =>
					fixTypeId(parameter.type)
				);
				fixTypeId(signature.type);
			});

			objectReflection.children = objectReflection.children?.map(
				(child) => fixMutateSignatureLinks(projectArray, child)
			);
			if (
				objectReflection.type &&
				'declaration' in objectReflection.type
			) {
				objectReflection.type.declaration = fixMutateSignatureLinks(
					projectArray,
					objectReflection.type.declaration as YAFDataObject
				);
			}
			return objectReflection;

			function filterReflections(
				reflection: YAFDataObject,
				name: string,
				filePrefix: string
			) {
				const { sources } = reflection;
				if (!sources) return false;
				const fileName = sources[0].fileName.split('.')[0];
				const isFile = sources && filePrefix.endsWith(fileName);

				const hasName = name === reflection.name;

				return isFile && hasName;
			}
			function fixTypeId(type: JSONOutput.SomeType) {
				if (type && 'types' in type) {
					return type.types.forEach((type) => fixTypeId(type));
				}
				if (type && 'elementType' in type) type = type.elementType;
				if (
					!type ||
					type.type !== 'reference' ||
					!!type.id ||
					!type['filePrefix']
				) {
					return;
				}
				const filePrefix = String(type['filePrefix']);
				delete type['filePrefix'];
				const name = type.name;
				const targetReflections = projectArray.filter((reflection) =>
					filterReflections(reflection, name, filePrefix)
				);

				if (targetReflections.length > 1) {
					console.warn(
						`[yaf] Parameter ${name} is ambiguously linked to reflection id's ${targetReflections
							.map((r) => r.id)
							.join(' and ')}. The link will be ignored`
					);
				}
				if (targetReflections.length === 1) {
					type['id'] = targetReflections[0].id;
				}
			}
		},

		/**
		 * The default TypeDoc declaration Reflection gets a `Property` kind, regardless if it has a call signature.
		 *
		 * This function fixes the frontend data to be the correct kind.
		 *
		 * @param objectReflection
		 * @returns
		 */
		fixObjectCallKind: (objectReflection: YAFDataObject) => {
			if (objectReflection.kind !== ReflectionKind.Property)
				return objectReflection;

			const hasSignatures = (
				objectReflection.type as JSONOutput.ReflectionType
			)?.declaration?.signatures;

			if (!hasSignatures) return objectReflection;

			const methodSignature =
				hasSignatures.length === 1 &&
				hasSignatures[0].kind === ReflectionKind.CallSignature
					? hasSignatures[0]
					: undefined;

			if (methodSignature)
				objectReflection.kind = ReflectionKind.CallSignature;

			return objectReflection;
		},
		/**
		 * The standard Typedoc data structure creates a container object `Reflection.type.declaration`
		 * to house reflection recursion.\
		 * This breaks the pattern which would otherwise be `Reflection.children[]`.
		 *
		 * This function bridges the break and passes down some properties from the parent to the frontend data structure.
		 *
		 * @param object The YafDataObject at the current point of recursion
		 * @param reflection The TypeDoc reflection corresponding to the `object`
		 * @param serialiser
		 * @param rootReflection The page parent Typedoc reflection (ie. the first ancestor on any given document page)
		 * @returns Void. Because there are a few different mappings to parse on the parent objects properties, this function
		 * mutates the object instead of returning a new value.
		 */
		fixMutateDeclarationReflections: (
			object: YafDeclarationReflection,
			reflection: serialiserReflection,
			serialiser: YafSerialiser,
			context: DefaultThemeRenderContext,
			rootReflection?: serialiserReflection
		) => {
			const { fixDeclarationSignatures } = YafSerialiser.fixerFactory;
			const { parseReflectionToYafDataObject } =
				YafSerialiser.parserFactory;
			const reflectionDeclaration =
				reflection.type && 'declaration' in reflection.type
					? reflection.type.declaration
					: undefined;

			if (!reflectionDeclaration) return;
			if (!rootReflection) {
				const parentKind = reflectionDeclaration.kind;
				const { Class, Interface, ClassOrInterface } = ReflectionKind;
				if ([Class, Interface, ClassOrInterface].includes(parentKind)) {
					rootReflection = reflection;
				}
			}

			const objectDeclaration = object.type.declaration as YAFDataObject;
			objectDeclaration.location = object.location;
			objectDeclaration.name = reflection.name;

			objectDeclaration.signatures = fixDeclarationSignatures(
				objectDeclaration as YAFDataObject,
				reflectionDeclaration,
				serialiser,
				context,
				rootReflection
			);

			objectDeclaration.children = objectDeclaration.children?.map(
				(objectChild, i) => {
					return parseReflectionToYafDataObject(
						objectChild as YAFDataObject,
						reflectionDeclaration.children[i],
						context,
						serialiser,
						object.location.hash,
						rootReflection || reflection
					);
				}
			);
		},
		/**
		 * Typedoc has already created groupings in the JSON output, before {@link fixObjectCallKind} has done it's job.
		 *
		 * This function re-maps the groupings for this correction by moving method reflections from the `Properties` group into the `Methods` group.
		 *
		 * @param object
		 * @returns Void. The child property is mutated.
		 */
		fixMutateReflectionGroups: (object: YAFDataObject) => {
			if (
				!object.type ||
				!('declaration' in object.type) ||
				!object.type.declaration.groups
			)
				return;

			const groups = object.type.declaration.groups;
			const children = object.type.declaration.children;

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
				propertyGroup.children = propertyGroup.children?.filter(
					(id) => {
						const child = children?.find(
							(child) => child.id === id
						);
						if (
							child &&
							child.kind === ReflectionKind.CallSignature
						) {
							methodGroup = getMethodGroup();
							methodGroup.children?.push(id);
							return false;
						}
						return true;
					}
				);
			object.type.declaration.groups = groups.filter(
				(group) => group.children?.length
			);
		},
	};

	/**
	 * A collection of utility methods to report on data.
	 *
	 * @group Factories
	 */
	private static utilities = {
		/**
		 * Indicates if the reflection kind has its own documentation page.
		 * @param kind
		 * @returns
		 */
		isPage: (kind: number) => {
			return this.hasOwnPage.indexOf(kind) > -1;
		},
		/**
		 * Indicates if the reflection displays any custom documentation text.
		 * @param object
		 * @returns
		 */
		hasVisibleTextComponent: (
			object:
				| YAFDataObject
				| YafSignatureReflection
				| YafParameterReflection
		) => {
			return (
				object.comment &&
				(object.comment.summary.some(
					(item) => item.kind !== 'text' || item.text !== ''
				) ||
					(object.comment.blockTags &&
						object.comment.blockTags.length > 0))
			);
		},
	};
	/**
	 * A list of the kinds of reflections which will generate their own document page in the front-end.
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
