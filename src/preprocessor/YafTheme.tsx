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
//import prettier from 'prettier';
import { cacheItem, dotName } from '../types';
//import { toCamelCase } from '../webComponents/YAFElement';

export class YafTheme extends DefaultTheme {
	private context?: YafThemeRenderContext;
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
			this.context?.frontEndDataCache.push([
				'yaf.root',
				rootSubPaths,
				null,
			]);

			const mergedCache: cacheItem = [];
			this.context?.frontEndDataCache.forEach((cacheItem) => {
				const foundItem = mergedCache.find(
					(i) => i[0] === cacheItem[0] && i[2] === cacheItem[2]
				);
				if (!foundItem) {
					mergedCache.push(cacheItem);
				} else {
					if (Array.isArray(foundItem[1])) {
						if (!Array.isArray(cacheItem[1]))
							throw new Error(
								'cannot merge non array data types'
							);
						return (foundItem[1] = [
							...foundItem[1],
							...(cacheItem[1] as []),
						]);
					}
					if (typeof foundItem[1] === 'object') {
						if (typeof cacheItem[1] !== 'object')
							throw new Error(
								'cannot merge non object data types'
							);
						return (foundItem[1] = {
							...foundItem[1],
							...(cacheItem[1] as object),
						});
					}
					if (foundItem[1] !== cacheItem[1])
						throw new Error(`String or number data value for "${cacheItem[0]}" is imuttable.
					Different values given for ${cacheItem[2]}`);
				}
			});
			mergedCache.forEach((item) => {
				saveDataToFile(
					...item,
					path.join(
						this.application.options.getValue('out'),
						'webComponents/data'
					)
				);
			});
		});
	}

	public override getRenderContext(): YafThemeRenderContext {
		this.context ||= new YafThemeRenderContext(
			this,
			this.application.options
		);
		return this.context;
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
 * @param data
 * @param id
 * @param fileRoot
 */
export function saveDataToFile(
	componentDotName: dotName,
	data: unknown,
	id: number | null,
	fileRoot: string
) {
	componentDotName =
		id === null ? componentDotName : `${componentDotName}.${id}`;
	const filePath = path.join(fileRoot, `${componentDotName}.data.json`);
	//const replacementVarName = toCamelCase(componentDotName);

	//const dataJson = JSON.stringify(data);
	fs.ensureDirSync(fileRoot);
	fs.writeJSONSync(filePath, data, { spaces: '\t' });
	/*
	let jsString: string;
	if (fs.existsSync(filePath)) {
		const initDataString = fs.readFileSync(filePath, 'utf-8');
		if (initDataString.indexOf(replacementVarName) === -1)
			throw new Error(
				`Expected var "${replacementVarName}" to exist in "${componentDotName}"`
			);
		const dataArray = initDataString.split(replacementVarName);
		if (dataArray[1].indexOf(';') === -1)
			throw new Error(
				`Var "${replacementVarName}" declaration must end with a ";" in file "${filePath}".`
			);

		const afterDataArray = dataArray[1].split(';');
		afterDataArray.shift();
		const afterData = afterDataArray.join(';');

		jsString = `${dataArray[0]}${replacementVarName}=${dataJson};${afterData}`;
	} else {
		fs.ensureDirSync(fileRoot);
		jsString = `const ${replacementVarName} = ${dataJson}`;
	}

	jsString = prettier.format(jsString, {
		tabWidth: 4,
		useTabs: true,
		singleQuote: true,
		parser: 'babel',
	});

	fs.writeFileSync(filePath, jsString, 'utf-8');
*/
}
