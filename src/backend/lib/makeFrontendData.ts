import {
	DeclarationReflection,
	JSONOutput,
	ProjectReflection,
	ReflectionKind,
	ReflectionType,
	Type,
	TypeContext,
} from 'typedoc';
import * as typeClasses from 'typedoc';

import {
	treeMenuRoot,
	YAFDataObject,
	YAFReflectionLink,
} from '../../types/types';

export const makeYafKindSymbols = (icons: Record<string, () => unknown>) => {
	const symbols = {};

	Object.keys(icons)
		.filter((key) => !!ReflectionKind[key])
		.forEach((key) => {
			const functionString = String(icons[key])
				.split('()')[1]
				.split('ReflectionKind.')[1]
				.split(/[^A-Z]/i)[0];

			symbols[key] = {
				className: functionString.toLocaleLowerCase(),
				symbol: functionString[0],
			};
		});

	return symbols;
};

export const makeYafReflectionMap = (
	data: YAFDataObject[],
	map: Record<string, YAFReflectionLink> = {}
) => {
	if (!data) return;

	data.forEach((objectReflection) => {
		const { id, name, location, kind, flags, parentId } = objectReflection;
		const mapId =
			kind === ReflectionKind.Project ? 'project' : objectReflection.id;

		map[mapId] = defaultReflectionLink(
			id,
			parentId,
			name,
			location,
			kind,
			flags
		);

		const hasChildren = objectReflection.children;
		const hasSignatures = objectReflection.signatures;

		const hasDeclarations =
			objectReflection.type && 'declaration' in objectReflection.type;

		if (hasChildren) {
			makeYafReflectionMap(objectReflection.children, map);
		}
		if (hasSignatures) {
			makeYafReflectionMap(
				objectReflection.signatures as YAFDataObject[],
				map
			);
		}
		if (hasDeclarations) {
			makeYafReflectionMap(
				(objectReflection.type as JSONOutput.ReflectionType).declaration
					.children as YAFDataObject[],
				map
			);
		}
	});
	return map;
};

const defaultReflectionLink = (
	id: number,
	parentId: number | undefined,
	name: string,
	location: { query: string; hash: string },
	kind: ReflectionKind,
	flags: JSONOutput.ReflectionFlags
) => {
	return {
		id,
		parentId,
		name,
		query: location.query,
		hash: location.hash,
		kind,
		flags,
	};
};

export const makeNeedsParenthesis = () => {
	const map = {};

	(<(new (array) => Type)[]>Object.values(typeClasses))
		.filter(
			(f) =>
				typeof f === 'function' &&
				String(f).indexOf('extends Type') > -1
		)
		.forEach((f) => {
			const newClass = new f([]);
			map[newClass.type] = {};
			Object.values(TypeContext).forEach((context) => {
				map[newClass.type][context] =
					newClass.needsParenthesis(context);
			});
		});

	return map;
};

/**
 * Builds a data tree for the main navigation menu
 * @param menuNode
 * @param reflection
 * @returns a hierarchical tree representation of the main navigation menu.
 */
export const makeNavTree = (
	reflection: DeclarationReflection | ProjectReflection,
	menuNode: treeMenuRoot = {}
): treeMenuRoot => {
	if (reflection.isProject()) {
		menuNode['project'] = {
			children: {},
		};
		reflection.children?.forEach((child) => makeNavTree(child, menuNode));
		return menuNode;
	}

	const { id, children, type } = reflection;
	menuNode[id] = {
		children: {},
	};

	children?.forEach((child) => {
		makeNavTree(child, menuNode[id].children);
	});
	if (type instanceof ReflectionType) {
		type.declaration.children?.forEach((child) => {
			makeNavTree(child, menuNode[reflection.id].children);
		});
	}

	return menuNode;
};
