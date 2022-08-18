import { cache, cacheLocation, dataCache } from '../types';
import { YafThemeRenderContext } from './YafThemeRenderContext';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';

export * from './layouts/yaf'
export * from './layouts/yaf.navigation.menu.tree';
export * from './layouts/yaf.navigation.menu.header';

export class BrowserDataCache {
	cache: dataCache;
	context: YafThemeRenderContext;
	constructor(context: YafThemeRenderContext){
		this.cache= {} as dataCache;
		this.context = context;
	}
	/**
	 * 
	 * @param location 
	 * @param value 
	 */
	public setCacheItem(location: cacheLocation, value: unknown) {
		const [leaf, key] = this.recurseCache(location.split('.'), this.cache as Partial<dataCache>);
		leaf[key] = value;
	};
	private recurseCache(keys: string[], branch: cache): [cache, string]{
		const key = keys.shift() as string;
		(!(key in branch)) && (branch[key] = {});
		if(keys.length === 0) return [branch, key];
		return this.recurseCache(keys, branch[key] as cache);
	}
	public saveToFile(rootDir: string){
		const filePath = path.join(rootDir, 'webComponents/yafData.js');
		let jsString = `window.yaf = ${JSON.stringify(this.cache.yaf)};`;
		jsString = prettier.format(jsString, {
			tabWidth: 4,
			useTabs: true,
			singleQuote: true,
			parser: 'babel'
		})
		fs.writeFileSync(filePath, jsString, 'utf-8');
	}
}