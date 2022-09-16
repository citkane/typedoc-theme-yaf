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
} from '../types.js';
import { serialize } from './serializer.js';

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
 * @param outDir The target directory for the documentation build
 */
export const copyThemeFiles = (outDir: string) => {
	const rootDir = path.join(__dirname, '..', '..', '../');
	const assetsDest = path.join(outDir, 'assets');
	const assetsSrc = path.join(rootDir, 'dist', 'src', 'assets');
	const webComponentsDest = path.join(outDir, 'webComponents');
	const indexSrc = path.join(assetsSrc, 'index.html');
	const indexDest = path.join(outDir, 'index.html');
	const webComponentsSrc = path.join(rootDir, 'dist', 'src', 'webComponents');
	fs.copySync(assetsSrc, assetsDest);
	fs.copySync(webComponentsSrc, webComponentsDest);
	fs.copySync(indexSrc, indexDest);
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
	if (isLeaf) hash = locationArray.pop() || '';
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
			children: {},
		};
		reflection.children?.forEach((child) => {
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
	['is', 'location', 'text', 'has'].forEach(
		(key) => !object[key] && (object[key] = {})
	);

	object = serialize(object, reflection, context);

	(object.children || []).forEach((objectChild) => {
		const reflectionChild = (reflection.children || []).find(
			(rc) => rc.id === objectChild.id
		);
		if (!reflectionChild)
			throw new Error(
				'JSONOutput.ProjectReflection does not match ProjectReflection'
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
/**
 * the subdirectory under the document output directory to which data .json files will be saved.
 */
const dataDir = 'webComponents/data';
/**
 * saves a data object to a data .json file for consumption by the front-end.
 * @param fileName
 * @param docDir
 * @param data
 * @param id
 */
export const saveDataFile = (
	fileName: string,
	docDir: string,
	data: { [key: symbol]: unknown } | YAFDataObject,
	id?: number
) => {
	if (typeof id !== 'undefined') fileName = `${fileName}.${id}`;
	fileName = `${fileName}.json`;
	const dirPath = path.join(docDir, dataDir);
	const filePath = path.join(dirPath, fileName);
	//console.log(`Saved data to file: ${filePath}`, 1);
	fs.ensureDirSync(path.dirname(filePath));
	fs.writeJsonSync(filePath, data);
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
