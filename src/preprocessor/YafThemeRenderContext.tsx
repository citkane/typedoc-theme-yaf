import { DefaultThemeRenderContext, JSX, Options } from "typedoc";
import { yafModel } from "../types";
import { BrowserDataCache, menuHeader, navigationMenuTree, yafIndex, yafPartial } from "./";
import { YafTheme } from "./YafTheme";

export class YafThemeRenderContext extends DefaultThemeRenderContext {
	menuHeader
	yaf: yafModel;
	browserDataCache: BrowserDataCache;
	partialLayout: Function;
	constructor(theme: YafTheme, options: Options) {
		super(theme, options);
		this.defaultLayout = yafIndex(this);
		this.partialLayout = yafPartial(this);
		this.browserDataCache = new BrowserDataCache(this);
		this.yaf = {
			navigation: {
				menu: {
					tree: navigationMenuTree
				}	
			}
		}
		this.menuHeader = menuHeader(this);
	}
}
