/**
 * This is the server side code which constructs the front-end assets for typedoc-theme yaf.
 *
 * Unlike the default theme, this theme produces .json data files instead of .html for consumption by the front-end.
 * All templating is moved to the front-end within native web components.
 *
 * @module preprocessor
 */

import { Application } from 'typedoc';

import { YafTheme } from './preProcessor/YafTheme';

/**
 * The theme entry point as per the typedoc {@link https://github.com/TypeStrong/typedoc/blob/master/internal-docs/custom-themes.md documentation}.
 * @param app
 */
export function load(app: Application) {
	app.renderer.defineTheme('yaf', YafTheme);
}

export { YafTheme } from './preProcessor/YafTheme';
export * as lib from './preProcessor/lib';
export { serialize } from './preProcessor/serializer';
