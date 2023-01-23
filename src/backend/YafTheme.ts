import path from 'path';
import fs from 'fs-extra';

import {
	DeclarationReflection,
	DefaultTheme,
	JSONOutput,
	PageEvent,
	ProjectReflection,
	Reflection,
	Renderer,
	RendererEvent,
	ReflectionKind,
	Type,
	TypeContext,
	ReflectionType,
} from 'typedoc';
import * as typeClasses from 'typedoc';
import { YAFDataObject, treeMenuRoot, YAFReflectionLink } from '../types/types';
import { getHighlighted } from './highlighter';
import { YafSerialiser } from './YafSerialiser';
import { highlighter } from '../types/backendTypes';
import { YafThemeRenderContext } from './YafThemeRenderContext';

let count = 0;
let oldRenderer: Renderer;

/**
 * This extends the TypeDoc default theme and provides a collection of overrides and methods to serialise and save data fragments
 * for consumption by the theme single page application (SPA) frontend.
 *
 */
export class YafTheme extends DefaultTheme {
	/**
	 * A placeholder for the replacement MD highlighter which is injected at {@link backend.load}.
	 */
	static highlighter: highlighter;

	constructor(renderer: Renderer) {
		super(oldRenderer || renderer);

		this.markedPlugin.getHighlighted = (text: string, lang?: string) =>
			getHighlighted(YafTheme.highlighter, text, lang);

		this.markedPlugin.getRelativeUrl = (absolute: string) => {
			console.log(absolute);
			return 'foo';
		};

		if (!oldRenderer) {
			this.application.renderer.on(
				RendererEvent.END,
				this.prepareYafTheme
			);
			oldRenderer = renderer;
		}
	}

	/**
	 * We do not have, or need the `PageEvent` function parameter of the default typedoc call,
	 * so override the default function.
	 * @returns the theme render `context`
	 */
	override getRenderContext(): YafThemeRenderContext {
		return new YafThemeRenderContext(this, this.application.options);
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
		console.log('prepareYafTheme', count);
		count++;
		const context = this.getRenderContext();
		const { saveYafThemeAssets } = YafTheme.fileFactory;
		const docDir = this.application.options.getValue('out') || 'docs';
		const rootDir = path.join(__dirname, '..', '..', '../');

		const project = output.project;

		const projectObject = this.application.serializer.toObject(project);
		const yafSerialiser = new YafSerialiser(
			projectObject as YAFDataObject,
			project as ProjectReflection & DeclarationReflection,
			context
		);

		saveYafThemeAssets(
			rootDir,
			docDir,
			yafSerialiser.dataObjectArray,
			project,
			context
		);
	};
	/**
	 * A collection of methods to work with data and files.
	 *
	 * @group Factories
	 */
	private static fileFactory = {
		/**
		 * Copies / saves various theme assets and data files for consumption by the front-end.
		 */
		saveYafThemeAssets: (
			rootDir: string,
			docDir: string,
			dataObjectArray: YafSerialiser['dataObjectArray'],
			project: ProjectReflection,
			context: YafThemeRenderContext
		) => {
			const { copyThemeFiles, saveDataFile } = this.fileFactory;
			const {
				makeNavTree,
				makeYafReflectionMap,
				makeYafKindSymbols,
				makeNeedsParenthesis,
			} = this.factory;

			copyThemeFiles(rootDir, docDir);
			saveDataFile('yafNavigationMenu', docDir, makeNavTree(project));
			saveDataFile(
				'yafReflectionMap',
				docDir,
				makeYafReflectionMap(dataObjectArray)
			);
			saveDataFile(
				'yafKindSymbols',
				docDir,
				makeYafKindSymbols(context.icons)
			);
			saveDataFile('yafReflectionKind', docDir, ReflectionKind);
			saveDataFile('yafNeedsParenthesis', docDir, makeNeedsParenthesis());
			dataObjectArray.forEach((object) => {
				const fileName =
					object.kind === ReflectionKind.Project
						? 'index'
						: object.location.query;
				saveDataFile(fileName, docDir, object);
			});
		},

		/**
		 * Copies various theme resource files into the documentation target directory.
		 * @param rootDir The absolute path to the project root
		 * @param outDir The absolute path to the root documentation out directory
		 */
		copyThemeFiles: (rootDir: string, outDir: string) => {
			const mediaSrc = path.join(rootDir, 'dist', 'src', 'media');
			const mediaDest = path.join(outDir, 'media');
			const frontendSrc = path.join(rootDir, 'dist', 'src', 'frontend');
			const frontendDest = path.join(outDir, 'frontend');
			const indexSrc = path.join(rootDir, 'src', 'index.html');
			const indexDest = path.join(outDir, 'index.html');

			fs.copySync(frontendSrc, frontendDest);
			fs.copySync(mediaSrc, mediaDest);
			fs.copySync(indexSrc, indexDest);
			setTimeout(() => {
				const assetsPath = path.join(outDir, 'assets');
				console.log(
					`This theme no longer needs the default theme assets, so deleting: ${assetsPath}`
				);
				fs.removeSync(assetsPath);
			});
		},

		/**
		 * saves a data object to a data .json file for consumption by the front-end.
		 * @param fileName the file name with or without .json extension
		 * @param docDir the absolute path to the document directory
		 * @param data
		 * @param dataDir the data subdirectory path under the document directory
		 */
		saveDataFile: (
			fileName: string,
			docDir: string,
			data: { [key: symbol]: unknown } | YAFDataObject,
			dataDir: string | false = 'data'
		) => {
			fileName = fileName.replace(/.JSON$/i, '.json');
			if (!fileName.endsWith('.json')) fileName = `${fileName}.json`;
			const dirPath = dataDir ? path.join(docDir, dataDir) : docDir;
			const filePath = path.join(dirPath, fileName);

			fs.ensureDirSync(path.dirname(filePath));
			fs.writeJsonSync(filePath, data);
		},
	};

	/**
	 * A collection of methods to create data for saving as frontend assets.
	 *
	 * @group Factories
	 */
	private static factory = {
		makeYafKindSymbols: (icons: Record<string, () => unknown>) => {
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
		},
		makeYafReflectionMap: (
			data: YAFDataObject[],
			map: Record<string, YAFReflectionLink> = {}
		) => {
			if (!data) return;

			const { defaultReflectionLink, makeYafReflectionMap } =
				this.factory;

			data.forEach((objectReflection) => {
				const { id, name, location, kind, flags, parentId } =
					objectReflection;
				const mapId =
					kind === ReflectionKind.Project
						? 'project'
						: objectReflection.id;

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
					objectReflection.type &&
					'declaration' in objectReflection.type;

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
						(objectReflection.type as JSONOutput.ReflectionType)
							.declaration.children as YAFDataObject[],
						map
					);
				}
			});
			return map;
		},
		defaultReflectionLink: (
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
		},

		makeNeedsParenthesis: () => {
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
		},

		/**
		 * Builds a data tree for the main navigation menu
		 * @param menuNode
		 * @param reflection
		 * @returns a hierarchical tree representation of the main navigation menu.
		 */
		makeNavTree: (
			reflection: DeclarationReflection | ProjectReflection,
			menuNode: treeMenuRoot = {}
		): treeMenuRoot => {
			const { makeNavTree } = this.factory;
			if (reflection.isProject()) {
				menuNode['project'] = {
					children: {},
				};
				reflection.children?.forEach((child) =>
					makeNavTree(child, menuNode)
				);
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
		},
	};
}
