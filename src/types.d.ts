import { JSX, PageEvent, Reflection } from 'typedoc';
import { YafThemeRenderContext } from './preprocessor/YafThemeRenderContext';
import { dotName } from './webComponents/types';

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
export type cacheItem = [cacheLocation, unknown, number | null][];
export type saveDataToFile = (
	componentDotName: dotName,
	data: unknown,
	fileRoot: string
) => void;
