/**
 * This is the server side code which constructs the front-end assets for typedoc-theme yaf.
 *
 * Unlike the default theme, this theme produces .json data files instead of .html for consumption by the front-end.
 * All templating is moved to the front-end within native web components.
 *
 * @module backend
 */

import { Application } from 'typedoc';
import { loadHighlighter } from './backend/lib/highlighter';

import { YafTheme } from './backend/YafTheme';

/**
 * The theme entry point as per the typedoc {@link https://github.com/TypeStrong/typedoc/blob/master/internal-docs/custom-themes.md documentation}.
 * @param app
 */
export function load(app: Application) {
	loadHighlighter().then((higlighter) => {
		YafTheme.highlighter = higlighter;
		app.renderer.defineTheme('yaf', YafTheme);
	});
}

export { YafTheme } from './backend/YafTheme';
export { YafSerialiser } from './backend/YafSerialiser';
export * as lib from './backend/lib/highlighter';
