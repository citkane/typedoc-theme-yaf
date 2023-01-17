/**
 * `typedoc-theme-yaf` Is a data driven single page application (SPA).\
 * You are hopefully looking at it right now.
 *
 * This backend module takes as it's input the standard TypeDoc outputs; `ProjectReflection` and `JSONOutput.ProjectReflection`,
 * and serialises it into `.json` output files for consumption by the frontend module.
 *
 * These files consist of:
 * - `.json` data fragments, one for each documentation page. This is analogous to the TypeDoc default theme `.html` output files.
 * - `yafKindSymbols.json`: a flat map of various reflection kinds to data for symbol creation.
 * - `yafNavigationMenu.json`: a deep map of reflection relationships.
 * - `yafNeedsParenthesis.json`: a flat map analogous to the TypeDoc `needsParenthesis()` method.
 * - `yafReflectionKind`: a flat map of reflection kinds analogous to the TypeDoc `ReflectionKind` map, which cannot be exported into ESM context.
 * - `yafReflectionMap`: a flat map indexed by id of all reflections providing linkage metadata.
 *
 * @module backend
 */

/**
 * `typedoc-theme-yaf` Strives to be visually consistent and comparable to the GitHub MarkDown rendering in look and feel.
 *
 * In order to facilitate compatibility with [github-markdown-css](https://github.com/sindresorhus/github-markdown-css),
 * the default TypeDoc highlighting module, `Shiki`, is replaced with [starry-night](https://github.com/wooorm/starry-night).
 */
export * as highlighter from './highlighter';
export * from './YafSerialiser';
export * from './YafTheme';
export * from '../index';
