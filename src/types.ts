import { JSX, PageEvent, Reflection } from 'typedoc';
import { YafThemeRenderContext } from './preprocessor/YafThemeRenderContext';

export * from './webComponents/types';

export interface yafModel {
	navigation: {
		menu: {
			tree: (
				context: YafThemeRenderContext,
				props: PageEvent<Reflection>
			) => JSX.Element;
		};
	};
}

export type cacheLocation = `yaf.${string}`;
