import { DefaultThemeRenderContext, Options } from 'typedoc';
import { cacheItem } from '../types';
import {
	yafNavigationMenuHeader,
	yafNavigationMenuTree,
	yafContent,
	yafIndex,
	yafReflectionTemplate,
	yafContentHeader,
} from './';
import { YafTheme } from './YafTheme';

export class YafThemeRenderContext extends DefaultThemeRenderContext {
	frontEndDataCache: cacheItem;
	constructor(theme: YafTheme, options: Options) {
		super(theme, options);
		this.frontEndDataCache = [];
	}
	defaultLayout = yafIndex(this);
	partialLayout = yafContent(this);

	reflectionTemplate = yafReflectionTemplate(this);

	yafNavigationMenuTree = yafNavigationMenuTree(this);
	yafNavigationMenuHeader = yafNavigationMenuHeader(this);
	yafContentHeader = yafContentHeader(this);
}
