import {
	DefaultTheme,
	DefaultThemeRenderContext,
	Options,
	Reflection,
} from 'typedoc';

export class YafThemeRenderContext extends DefaultThemeRenderContext {
	constructor(theme: DefaultTheme, options: Options) {
		super(theme, options);
	}
	override urlTo = (reflection: Reflection) => {
		console.log(reflection.name);
		return this.relativeURL(reflection.url);
	};
}
