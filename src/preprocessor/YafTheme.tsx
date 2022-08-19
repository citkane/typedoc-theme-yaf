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
import prettier from 'prettier';
import { dotName } from '../types';

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

/**
 * Takes data from this backend document parser and injects it
 * into a .js file for consumption by the web frontend
 *
 * @param componentDotName
 * @param replacementVarName
 * @param data
 */
export function saveDataToFile(
	componentDotName: dotName,
	data: unknown,
	fileRoot: string = path.join(__dirname, '../webComponents/components')
) {
	const filePath = path.join(fileRoot, `${componentDotName}.data.js`);
	const replacementVarName = toCamelCase(componentDotName);
	const initDataString = fs.readFileSync(filePath, 'utf-8');
	if (initDataString.indexOf(replacementVarName) === -1)
		throw new Error(
			`Expected var "${replacementVarName}" to exist in "${componentDotName}"`
		);

	const dataJson = JSON.stringify(data);

	const dataArray = initDataString.split(replacementVarName);
	if (dataArray[1].indexOf(';') === -1)
		throw new Error(
			`Var "${replacementVarName}" declaration must end with a ";" in file "${filePath}".`
		);

	const afterDataArray = dataArray[1].split(';');
	afterDataArray.shift();
	const afterData = afterDataArray.join(';');

	let jsString = `${dataArray[0]}${replacementVarName}=${dataJson};${afterData}`;
	jsString = prettier.format(jsString, {
		tabWidth: 4,
		useTabs: true,
		singleQuote: true,
		parser: 'babel',
	});

	fs.writeFileSync(filePath, jsString, 'utf-8');
}

export function toCamelCase(dotName: dotName) {
	const varNameArray = dotName.split('.').map((item, i) => {
		return i ? `${item.charAt(0).toUpperCase()}${item.slice(1)}` : item;
	});
	return varNameArray.join('');
}
