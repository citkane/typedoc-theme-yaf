import {
	ContainerReflection,
	DeclarationReflection,
	DefaultTheme,
	JSX,
	PageEvent,
	ProjectReflection,
	Reflection,
	Renderer,
	RendererEvent,
	UrlMapping,
} from 'typedoc';
import { YafThemeRenderContext } from './YafThemeRenderContext';
import fs from 'fs-extra';
import path from 'path';

export class YafTheme extends DefaultTheme {
	private _contextCache?: YafThemeRenderContext;
	constructor(renderer: Renderer) {
		super(renderer);
		const rootFolder = path.join(__dirname, '../../../');
		const outDir = this.application.options.getValue('out');
		const themeAssetsOut = path.join(outDir, './assets');
		const themeAssets = path.join(rootFolder, 'dist/src/assets');

		const webComponentsOut = path.join(outDir, './webComponents');
		const webComponents = path.join(rootFolder, 'dist/src/webComponents');

		this.listenTo(this.owner, RendererEvent.END, () => {
			fs.copySync(themeAssets, themeAssetsOut);
			fs.copySync(webComponents, webComponentsOut);
			const rootSubPaths = fs
				.readdirSync(outDir)
				.filter((file) =>
					fs.statSync(path.join(outDir, file)).isDirectory()
				);
			this._contextCache?.browserDataCache.setCacheItem(
				'yaf.rootSubPaths',
				rootSubPaths
			);
			this._contextCache?.browserDataCache.saveToFile(outDir);
		});
	}
	public override getRenderContext(): YafThemeRenderContext {
		this._contextCache ||= new YafThemeRenderContext(
			this,
			this.application.options
		);
		return this._contextCache;
	}

	override getUrls(project: ProjectReflection): UrlMapping[] {
		const urls: UrlMapping[] = [];

		if (false == hasReadme(this.application.options.getValue('readme'))) {
			project.url = 'index.html';
			urls.push(
				new UrlMapping<ContainerReflection>(
					'index.html',
					project,
					this.reflectionTemplate
				)
			);
			urls.push(
				new UrlMapping<ContainerReflection>(
					'home.html',
					project,
					this.reflectionTemplate
				)
			);
		} else {
			project.url = 'modules.html';
			urls.push(
				new UrlMapping<ContainerReflection>(
					'modules.html',
					project,
					this.reflectionTemplate
				)
			);
			urls.push(
				new UrlMapping('index.html', project, this.indexTemplate)
			);
			urls.push(new UrlMapping('home.html', project, this.indexTemplate));
		}
		project.children?.forEach((child: Reflection) => {
			if (child instanceof DeclarationReflection) {
				this.buildUrls(child, urls);
			}
		});
		return urls;
	}
	override defaultLayoutTemplate = (pageEvent: PageEvent<Reflection>) => {
		return this.getRenderContext().defaultLayout(pageEvent);
	};
	partialLayoutTemplate = (pageEvent: PageEvent<Reflection>) => {
		return this.getRenderContext().partialLayout(pageEvent);
	};
	override render(page: PageEvent<Reflection>): string {
		const templateOutput =
			page.url === 'index.html'
				? this.defaultLayoutTemplate(page)
				: this.partialLayoutTemplate(page);

		return page.url === 'index.html'
			? '<!DOCTYPE html>\n' + JSX.renderElement(templateOutput)
			: JSX.renderElement(templateOutput);
	}
}
function hasReadme(readme: string) {
	return !readme.endsWith('none');
}
