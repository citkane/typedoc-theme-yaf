/**
 * Some stuff to say here hooray!!
 *
 * @module frontend
 */
export { default as YafHTMLElement } from './YafHTMLElement.js';
export * from './YafElementDrawers.js';
/**
 * A Yaf Theme factory for fetching, creating, manipulating, querying
 * and appending HTML Elements and Text.
 */
export * as yafElement from './yafElement.js';
/**
 * Handler classes and libraries for state, routing, errors and events.
 */
export * as handlers from './handlers/index.js';
/**
 * Yaf Theme is an assembly of native HTML [Web Components](https://en.wikipedia.org/wiki/Web_Components).
 *
 * This library replicates (in principle) the semantics of the default TypeDoc theme backend templating into the frontend scope.
 * It tries to be semantically as close as possible to the default, but does depart in some details and sometimes takes it own tangent...
 *
 * All data to feed the frontend component logic is {@link backend!YafTheme#saveYafThemeAssets | generated at document build time} as .json fragments
 * (instead of the default theme HTML pages) and loaded into the browser as required.
 */
export * as webComponents from './webComponents/index.js';
