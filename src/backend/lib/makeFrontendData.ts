import {
	DeclarationReflection,
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
import { YafSerializer } from '../Serialiser';

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
	data.forEach((reflection) => {
		map[String(reflection.id)] = {
			name: reflection.name,
			fileName: reflection.location.query,
		};

		if (reflection.children) makeYafReflectionMap(reflection.children, map);
	});
	return map;
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
	menuNode: treeMenuRoot = {},
	isDeclarationChild = false
): treeMenuRoot => {
	if (reflection.isProject()) {
		reflection.children?.forEach((child) => makeNavTree(child, menuNode));
	} else {
		const { hash, query } = YafSerializer.formatReflectionLocation(
			reflection,
			isDeclarationChild
		);

		menuNode[reflection.id] = {
			name: reflection.name,
			query,
			hash,
			kind: reflection.kind,
			id: reflection.id,
			children: {},
			flags: YafSerializer.extendDefaultFlags(reflection),
			inheritedFrom: reflection.inheritedFrom
				? reflection.inheritedFrom.qualifiedName
				: undefined,
		};
		reflection.children?.forEach((child) => {
			makeNavTree(child, menuNode[reflection.id].children);
		});

		if (reflection.type instanceof ReflectionType) {
			reflection.type.declaration.children?.forEach((child) => {
				const childClone = YafSerializer.fixedReflectionChild(
					child,
					reflection
				);
				makeNavTree(childClone, menuNode[reflection.id].children, true);
			});
		}
	}
	return menuNode;
};
