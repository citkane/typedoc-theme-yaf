import path from 'path';
import fs from 'fs-extra';

import {
	DeclarationReflection,
	DefaultTheme,
	DefaultThemeRenderContext,
	JSONOutput,
	PageEvent,
	ProjectReflection,
	Reflection,
	Renderer,
	RendererEvent,
	ReflectionKind,
} from 'typedoc';
import {
	YAFDataObject,
	reflectionMap,
	treeMenuRoot,
	needsParenthesis,
} from '../types/types';
import { getHighlighted } from './lib/highlighter';
import {
	makeNavTree,
	makeNeedsParenthesis,
	makeYafKindSymbols,
	makeYafReflectionMap,
} from './lib/makeFrontendData';
import { YafSerializer } from './Serialiser';
import { highlighter } from '../types/backendTypes';

/**
 * The YAF extension to the default typedoc theme.
 *
 * @todo Report issue regarding asynchronous callbacks to typedoc.
 * @version 0.1.0
 */
export class YafTheme extends DefaultTheme {
	static highlighter: highlighter;

	project: ProjectReflection;
	projectObject: JSONOutput.ProjectReflection;
	menuData: treeMenuRoot;
	yafSerialiser: YafSerializer;
	reflectionMapData: reflectionMap;
	needsParenthesis: needsParenthesis;

	docDir = this.application.options.getValue('out') || 'docs';
	rootDir = path.join(__dirname, '..', '..', '../');
	context = this.getRenderContext();

	constructor(renderer: Renderer) {
		super(renderer);

		this.markedPlugin.getHighlighted = (text: string, lang?: string) =>
			getHighlighted(YafTheme.highlighter, text, lang);

		this.markedPlugin.getRelativeUrl = (absolute: string) => {
			console.log(absolute);
			return 'foo';
		};

		this.application.renderer.on(RendererEvent.BEGIN, this.prepareYafTheme);
	}

	/**
	 * We do not have, or need the `PageEvent` function parameter of the default typedoc call,
	 * so override the default function.
	 * @returns the theme render `context`
	 */
	override getRenderContext(): DefaultThemeRenderContext {
		return new DefaultThemeRenderContext(this, this.application.options);
	}

	/**
	 * Prevents the default typedoc `render` call from saving pages to html.
	 * @param page
	 * @returns
	 */
	override render(page: PageEvent<Reflection>) {
		page.preventDefault();
		return '';
	}

	/**
	 * Triggered at the typedoc `RendererEvent.BEGIN` event.
	 *
	 * It prepares various items of data that are to be consumed by the theme front-end;
	 *
	 * @param output
	 */
	prepareYafTheme = (output: RendererEvent) => {
		this.project = output.project;
		this.projectObject = this.application.serializer.toObject(this.project);
		this.yafSerialiser = new YafSerializer(
			this.projectObject as YAFDataObject,
			this.project as ProjectReflection & DeclarationReflection,
			this.context
		);

		this.saveYafThemeAssets();
	};

	/**
	 * Copies / saves various theme assets and data files for consumption by the front-end.
	 */
	saveYafThemeAssets = () => {
		YafTheme.copyThemeFiles(this.rootDir, this.docDir);
		console.log(this.rootDir, this.docDir);
		YafTheme.saveDataFile(
			'yafNavigationMenu',
			this.docDir,
			makeNavTree(this.project)
		);
		YafTheme.saveDataFile(
			'yafReflectionMap',
			this.docDir,
			makeYafReflectionMap(this.yafSerialiser.dataObjectArray)
		);
		YafTheme.saveDataFile(
			'yafKindSymbols',
			this.docDir,
			makeYafKindSymbols(this.context.icons)
		);
		YafTheme.saveDataFile('yafReflectionKind', this.docDir, ReflectionKind);
		YafTheme.saveDataFile(
			'yafNeedsParenthesis',
			this.docDir,
			makeNeedsParenthesis()
		);
		this.yafSerialiser.dataObjectArray.forEach((object) => {
			const fileName = object.is.project
				? 'index'
				: object.location.query;
			YafTheme.saveDataFile(fileName, this.docDir, object);
		});
	};

	/**
	 * Copies various theme resource files into the documentation target directory.
	 * @param rootDir The absolute path to the project root
	 * @param outDir The absolute path to the root documentation out directory
	 */
	private static copyThemeFiles = (rootDir: string, outDir: string) => {
		const assetsSrc = path.join(
			rootDir,
			'dist',
			'src',
			'frontend',
			'assets'
		);
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
	private static saveDataFile = (
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
}
