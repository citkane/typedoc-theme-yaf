import path from 'path';
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
} from 'typedoc';
import { YAFDataObject, reflectionMap, treeMenuRoot } from '../types';
import {
	buildNavTree,
	copyThemeFiles,
	getHighlighted,
	KindSymbols,
	loadHighlighter,
	makeReflectionMapData,
	parseProject,
	saveDataFile,
} from './lib';

/**
 * The YAF extension to the default typedoc theme.
 *
 * @todo Report issue regarding asynchronous callbacks to typedoc.
 * @version 0.1.0
 */
export class YafTheme extends DefaultTheme {
	project: ProjectReflection;
	projectObject: JSONOutput.ProjectReflection;
	menuData: treeMenuRoot;
	reflectionDataObjects: YAFDataObject[];
	reflectionMapData: reflectionMap;

	constructor(renderer: Renderer) {
		super(renderer);
		this.application.renderer.on(RendererEvent.BEGIN, this.prepareYafTheme);

		/**
		 * Callbacks to typedoc events appear to be synchronous, thus asynchrounous
		 * code in `BEGIN` fires after `END`.
		 *
		 * The below line of code would be semantically better, but not feasible ATM.
		 *
		 */
		//this.application.renderer.on(RendererEvent.END, this.commitYafTheme);
	}

	/**
	 * We do not have, or need the `PageEvent` function parameter of the default typedoc call,
	 * so override the default function.
	 * @returns the theme render `context`
	 */
	override getRenderContext(): DefaultThemeRenderContext {
		return new DefaultThemeRenderContext(this, this.application.options);
	}
	context = this.getRenderContext();

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
	 * The documentation output directory.
	 */
	docDir = this.application.options.getValue('out');
	rootDir = path.join(__dirname, '..', '..', '../');

	/**
	 * Triggered at the typedoc `RendererEvent.BEGIN` event.
	 *
	 * It prepares various items of data that are to be consumed by the theme front-end;
	 *
	 * @param output
	 */
	prepareYafTheme = async (output: RendererEvent) => {
		this.project = output.project;
		this.projectObject = this.application.serializer.toObject(this.project);
		this.menuData = buildNavTree({}, this.project);

		const highlighter = await loadHighlighter(); //uses "Starry Night" to emulate GitHub.
		this.markedPlugin.getHighlighted = (text: string, lang?: string) =>
			getHighlighted(highlighter, text, lang);

		this.reflectionDataObjects = parseProject(
			this.projectObject as YAFDataObject,
			this.project as ProjectReflection & DeclarationReflection,
			this.context
		);

		this.reflectionMapData = makeReflectionMapData(
			this.reflectionDataObjects
		);
		this.saveYafThemeAssets();
	};

	/**
	 * Copies / saves various theme assets and data files for consumption by the front-end.
	 */
	saveYafThemeAssets = () => {
		copyThemeFiles(this.rootDir, this.docDir);
		saveDataFile('yafNavigationMenu', this.docDir, this.menuData);
		saveDataFile('yafReflectionMap', this.docDir, this.reflectionMapData);
		saveDataFile('yafKindSymbols', this.docDir, KindSymbols);
		this.reflectionDataObjects.forEach((object) => {
			const fileName = object.is.project
				? 'index'
				: object.location.query;
			saveDataFile(fileName, this.docDir, object);
		});
	};
}
