import { ReflectionKind, Type, TypeContext } from 'typedoc';
import * as typeClasses from 'typedoc';

import { YAFDataObject, YAFReflectionLink } from '../../types/types';

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
