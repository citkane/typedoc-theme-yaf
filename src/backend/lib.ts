/**
 * A library of static functions used for consumption by the server side pre-processor of the theme.
 */
import path from 'path';
import fs from 'fs-extra';
import {
	DeclarationReflection,
	DefaultThemeRenderContext,
	ProjectReflection,
	ReflectionKind,
} from 'typedoc';
import {
	dataLocation,
	treeMenuRoot,
	YAFDataObject,
	reflectionMap,
	htmlString,
	highlighter,
	kindSymbols,
} from '../types/types';
import { serialize } from './serializer';

/**
 * The kinds of reflections which will generate their own document page in the front-end.
 */
const hasOwnPage = [
	ReflectionKind.Class,
	ReflectionKind.Interface,
	ReflectionKind.Enum,
	ReflectionKind.Namespace,
	ReflectionKind.Module,
	ReflectionKind.TypeAlias,
	ReflectionKind.Function,
	ReflectionKind.Variable,
];

/**
 * Copies various theme resource files into the documentation target directory.
 * @param rootDir The absolute path to the project root
 * @param outDir The absolute path to the root documentation out directory
 */
export const copyThemeFiles = (rootDir: string, outDir: string) => {
	const assetsSrc = path.join(rootDir, 'dist', 'src', 'frontend', 'assets');
	const indexSrc = path.join(assetsSrc, 'index.html');
	const frontendSrc = path.join(rootDir, 'dist', 'src', 'frontend');

	const frontendDest = path.join(outDir, 'frontend');
	const indexDest = path.join(outDir, 'index.html');

	fs.copySync(frontendSrc, frontendDest);
	fs.copySync(indexSrc, indexDest);
};

/**
 * saves a data object to a data .json file for consumption by the front-end.
 * @param fileName the file name with or without .json extension
 * @param docDir the absolute path to the document directory
 * @param data
 * @param dataDir the data subdirectory path under the document directory
 */
export const saveDataFile = (
	fileName: string,
	docDir: string,
	data: { [key: symbol]: unknown } | YAFDataObject,
	dataDir: string | false = 'frontend/data'
) => {
	fileName = fileName.replace(/.JSON$/i, '.json');
	if (!fileName.endsWith('.json')) fileName = `${fileName}.json`;
	const dirPath = dataDir ? path.join(docDir, dataDir) : docDir;
	const filePath = path.join(dirPath, fileName);

	fs.ensureDirSync(path.dirname(filePath));
	fs.writeJsonSync(filePath, data);
};
/**
 * Determines if a reflection is a leaf (hash link) on a page, or it's own page
 * @param reflection
 * @returns true if a leaf else false
 */
const isRefelectionLeaf = (
	reflection: DeclarationReflection | ProjectReflection
) => {
	return hasOwnPage.indexOf(reflection.kind) === -1;
};

/**
 * Formats data regarding the intended URL location of the reflection data.
 * @param reflection
 * @returns a data object which will extend the typedoc `JSONOutput` reflection
 */
export const formatReflectionLocation = (
	reflection: DeclarationReflection | ProjectReflection
): dataLocation => {
	let hash = '';
	const isLeaf = isRefelectionLeaf(reflection);
	const locationArray = reflection.getFriendlyFullName().split('.');
	if (isLeaf && locationArray.length) hash = locationArray.pop();
	const query = locationArray.join('.');
	return {
		hash,
		query,
		isLeaf,
	};
};

/**
 * Builds a data tree for the main navigation menu
 * @param menuNode
 * @param reflection
 * @returns a hierarchical tree representation of the main navigation menu.
 */
export const buildNavTree = (
	menuNode: treeMenuRoot,
	reflection: DeclarationReflection | ProjectReflection
): treeMenuRoot => {
	if (reflection.isProject()) {
		reflection.children?.forEach((child) => buildNavTree(menuNode, child));
	} else {
		const { hash, query } = formatReflectionLocation(reflection);
		menuNode[reflection.id] = {
			name: reflection.name,
			query,
			hash,
			kind: reflection.kind,
			id: reflection.id,
			children: {},
		};
		reflection.children?.forEach((child) => {
			if (!child.inheritedFrom)
				buildNavTree(menuNode[reflection.id].children, child);
		});
	}
	return menuNode;
};

/**
 * Orchestrates the extended data serialization between `JSONOutput.Reflection` and `Reflection`
 * @param object
 * @param reflection
 * @param context
 * @returns an array of data objects ready to be saved to .json files
 */
export const parseProject = (
	object: YAFDataObject,
	reflection: ProjectReflection & DeclarationReflection,
	context: DefaultThemeRenderContext
) =>
	parseProjectObjectToArray(
		[],
		parseProjectToObject(object, reflection, context)
	);

/**
 * Loops over the typedoc serialized JSONOutput and unserialized project reflections in lock step,
 * extracting data from the latter and extending the former for consumption by front-end web components.
 * @param object
 * @param reflection
 * @param context
 * @param tdSerializer
 * @returns
 */
const parseProjectToObject = (
	object: YAFDataObject,
	reflection: ProjectReflection & DeclarationReflection,
	context: DefaultThemeRenderContext
) => {
	object.children = object.children?.filter((child) => !child.inheritedFrom);
	if (object.groups)
		object.groups.forEach((group) => {
			group.children = group.children.filter(
				(id) => !!object.children.find((child) => child.id === id)
			);
		});
	object = serialize(object, reflection, context);
	object.children?.forEach((objectChild) => {
		const reflectionChild = reflection.children.find(
			(rc) => rc.id === objectChild.id
		);
		parseProjectToObject(
			objectChild as YAFDataObject,
			reflectionChild as ProjectReflection & DeclarationReflection,
			context
		);
	});

	return object as YAFDataObject;
};

/**
 * Parses over the extended JSONOutput project object and extracts each reflection into an array of reflections.
 * @param objects
 * @param object
 * @returns an array of extended JSONOutput reflections
 */
const parseProjectObjectToArray = (
	objects: YAFDataObject[],
	object: YAFDataObject
) => {
	const thisChildren: YAFDataObject[] = [];
	const newChildren: YAFDataObject[] = [];
	object.children?.forEach((child: YAFDataObject) => {
		child.is.leaf ? thisChildren.push(child) : newChildren.push(child);
	});
	object.children = thisChildren;
	objects.push(object);
	newChildren.forEach((child) => {
		parseProjectObjectToArray(objects, child);
	});
	return objects;
};

/**
 * Recurses over a reflection and it's children,
 * mutating the given map object to add id key mapped to data.
 * @param reflectionMap the given map object to be mutated
 * @param object
 * @param level is the item a page or a child hash
 */
const mutateReflectionMap = (
	reflectionMap: reflectionMap,
	object: YAFDataObject,
	level: 0 | 1
) => {
	if (reflectionMap[object.id])
		throw new Error('Reflection ID was already mapped');
	reflectionMap[object.id] = {
		name: object.name,
		fileName: object.location.query,
		level,
	};
	object.children?.forEach((child) => {
		mutateReflectionMap(reflectionMap, child, 1);
	});
};
/**
 * Creates a key value object map of reflection id's to reflection data file names.
 * @param reflectionDataObjects
 * @returns
 */
export const makeReflectionMapData = (
	reflectionDataObjects: YAFDataObject[]
) => {
	const reflectionMap: reflectionMap = {};
	reflectionDataObjects.forEach((reflectionData) => {
		mutateReflectionMap(reflectionMap, reflectionData, 0);
	});
	return reflectionMap;
};

/**
 * Loads the ESM only modules `[starry-night](https://github.com/wooorm/starry-night)`
 * and `[hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html)` as dynamic imports.
 * Constructs the various functions required to return HTML markup from text.
 *
 * This is a drop-in replacement for the default typedoc `shiki` highlighter.
 *
 * It provides HTML markup compatible with `[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)`,
 * which is used in the front-end of this theme.
 *
 * [Supported language parsing.](https://github.com/wooorm/starry-night#languages)
 *
 * @returns an interface of functions to facilitate highlighting in typedoc-theme-yaf
 *
 * @todo Allow for user options to extend the `common` language parser modules.
 */
export const loadHighlighter = async (): Promise<highlighter> => {
	/* WORKAROUND:
	 * "starry-night" and "hast-util-to-html" are ESM only modules, but "typdoc" does not support ESM
	 */
	const dynamicImport = new Function('specifier', 'return import(specifier)');
	const { toHtml } = (await dynamicImport('hast-util-to-html')) as {
		toHtml: () => htmlString;
	};
	const { createStarryNight, common } = await dynamicImport(
		'@wooorm/starry-night'
	);
	/* END WORKAROUND */

	const starryNight = await createStarryNight(common);
	return {
		toHtml,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		flagToScope: (<any>starryNight).flagToScope,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		highlight: (<any>starryNight).highlight,
	};
};

/**
 * Converts a string into language highlighted HTML code using the `starry-night` highlighter.
 * @param highlighter
 * @param text
 * @param lang
 * @returns the highlighted HTML markup or the original string of unknown language types.
 */
export const getHighlighted = (
	highlighter: highlighter,
	text: string,
	lang?: string
) => {
	lang = lang || 'typescript';
	const scope = highlighter.flagToScope(lang);
	const hast = scope ? highlighter.highlight(text, scope) : undefined;
	const html = hast ? highlighter.toHtml(hast) : text;
	return html;
};

export const KindSymbols: kindSymbols = {
	[ReflectionKind.Accessor]: {
		className: 'accessor',
		symbol: 'A',
	},
	[ReflectionKind.Class]: {
		className: 'class',
		symbol: 'C',
	},
	[ReflectionKind.Constructor]: {
		className: 'constructor',
		symbol: 'C',
	},

	[ReflectionKind.Enum]: {
		className: 'enumerator',
		symbol: 'E',
	},
	[ReflectionKind.Function]: {
		className: 'function',
		symbol: 'F',
	},
	[ReflectionKind.Interface]: {
		className: 'interface',
		symbol: 'I',
	},
	[ReflectionKind.Method]: {
		className: 'method',
		symbol: 'M',
	},
	[ReflectionKind.Namespace]: {
		className: 'namespace',
		symbol: 'N',
	},
	[ReflectionKind.Property]: {
		className: 'property',
		symbol: 'P',
	},
	[ReflectionKind.Reference]: {
		className: 'reference',
		symbol: 'R',
	},
	[ReflectionKind.Variable]: {
		className: 'variable',
		symbol: 'V',
	},
	[ReflectionKind.TypeAlias]: {
		className: 'typealias',
		symbol: 'T',
	},
	[ReflectionKind.Module]: {
		className: 'module',
		symbol: 'M',
	},
};
KindSymbols[ReflectionKind.CallSignature] =
	KindSymbols[ReflectionKind.Function];
KindSymbols[ReflectionKind.ConstructorSignature] =
	KindSymbols[ReflectionKind.Constructor];
KindSymbols[ReflectionKind.EnumMember] = KindSymbols[ReflectionKind.Property];
KindSymbols[ReflectionKind.GetSignature] = KindSymbols[ReflectionKind.Accessor];
KindSymbols[ReflectionKind.IndexSignature] =
	KindSymbols[ReflectionKind.Property];
// KindSymbols[ReflectionKind.Module] = KindSymbols[ReflectionKind.Namespace];
KindSymbols[ReflectionKind.ObjectLiteral] =
	KindSymbols[ReflectionKind.Interface];
KindSymbols[ReflectionKind.Parameter] = KindSymbols[ReflectionKind.Property];
KindSymbols[ReflectionKind.Project] = KindSymbols[ReflectionKind.Namespace];
KindSymbols[ReflectionKind.SetSignature] = KindSymbols[ReflectionKind.Accessor];
KindSymbols[ReflectionKind.TypeLiteral] = KindSymbols[ReflectionKind.TypeAlias];
KindSymbols[ReflectionKind.TypeParameter] =
	KindSymbols[ReflectionKind.TypeAlias];
