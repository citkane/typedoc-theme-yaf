import { htmlString } from '../types/types';
import { highlighter } from '../types/backendTypes';

/**
 * The highlighter and tooling [starry-night](https://github.com/wooorm/starry-night)
 * and [hast-util-to-html](https://github.com/syntax-tree/hast-util-to-html) is only available as ES modules,
 * which TypeDoc is not compatible with.
 *
 * This function creates dynamic imports to work around the problem.
 *
 * It then constructs the various functions required to return HTML markup from text.
 *
 * @returns A collection of functions to convert a string into highlighted HTML.
 */
export const loadHighlighter = async (): Promise<highlighter> => {
	const dynamicImport = new Function('specifier', 'return import(specifier)');
	const { toHtml } = (await dynamicImport('hast-util-to-html')) as {
		toHtml: () => htmlString;
	};
	const { createStarryNight, common } = await dynamicImport(
		'@wooorm/starry-night'
	);

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
 * `typedoc-theme-yaf` aims to be visually compatible and consistent with `GitHub` as far as practical.
 *
 * This is not practical with the TypeDoc default `shiki` highlighter module, so this is replaced with the
 * [starry-night](https://github.com/wooorm/starry-night) highlighter. This provides compatibility with
 * [github-markdown-css](https://github.com/sindresorhus/github-markdown-css).
 *
 * @param highlighter
 * @param text
 * @param lang
 * @returns An HTML string with `github-markdown-css` compatible markup.
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
