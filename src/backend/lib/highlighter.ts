import { htmlString } from '../../types/types';
import { highlighter } from '../../types/backendTypes';

/**
 * Loads the ESM only modules `[starry-night](https://github.com/wooorm/starry-night)`
 * and `[hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html)` as dynamic imports.
 * Constructs the various functions required to return HTML markup from text.
 *
 * This is a drop-in replacement for the default typedoc `shiki` highlighter.
 *
 * It provides HTML markup compatible with `[github-markdown-css](https://github.com/sindresorhus/github-markdown-css)`,
 * which is used in the front-end of this theme.
 *
 * [Supported language parsing.](https://github.com/wooorm/starry-night#languages)
 *
 * @returns an interface of functions to facilitate highlighting in typedoc-theme-yaf
 *
 * @todo Allow for user options to extend the `common` language parser modules.
 */
export const loadHighlighter = async (): Promise<highlighter> => {
	/* WORKAROUND:
	 * "starry-night" and "hast-util-to-html" are ESM only modules, but "typdoc" does not support ESM
	 */
	const dynamicImport = new Function('specifier', 'return import(specifier)');
	const { toHtml } = (await dynamicImport('hast-util-to-html')) as {
		toHtml: () => htmlString;
	};
	const { createStarryNight, common } = await dynamicImport(
		'@wooorm/starry-night'
	);
	/* END WORKAROUND */

	const starryNight = await createStarryNight(common);
	return {
		toHtml,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		flagToScope: (<any>starryNight).flagToScope,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		highlight: (<any>starryNight).highlight,
	};
};

/**
 * Converts a string into language highlighted HTML code using the `starry-night` highlighter.
 * @param highlighter
 * @param text
 * @param lang
 * @returns the highlighted HTML markup or the original string of unknown language types.
 */
export const getHighlighted = (
	highlighter: highlighter,
	text: string,
	lang?: string
) => {
	lang = lang || 'typescript';
	const scope = highlighter.flagToScope(lang);
	const hast = scope ? highlighter.highlight(text, scope) : undefined;
	const html = hast ? highlighter.toHtml(hast) : text;
	return html;
};
