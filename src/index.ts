import { Application } from 'typedoc';
import { loadHighlighter } from './backend/highlighter';

import { YafTheme } from './backend/YafTheme';

/**
 * This is the theme entry point as per the {@link https://github.com/TypeStrong/typedoc/blob/master/internal-docs/custom-themes.md TypeDoc documentation}.
 *
 * Note that the theme is defined asynchronously within the {@link backend.highlighter.loadHighlighter} method call.
 *
 * The default `shiki` highlighter is replaced for {@link backend.highlighter.getHighlighted reasons}.\
 * This is a workaround in order to dynamically load the replacement ESM [starry-night](https://github.com/wooorm/starry-night) Markdown Highlighter.
 * @param app
 */
export function load(app: Application) {
	loadHighlighter().then((higlighter) => {
		YafTheme.highlighter = higlighter;
		app.renderer.defineTheme('yaf', YafTheme);
	});
}
