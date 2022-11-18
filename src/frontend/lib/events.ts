/**
 * Something about events here
 *
 * @module
 */

import { YAFDataObject } from '../types.js';
import { trigger } from './eventApi.js';

/**
 * Notifies that the URL location for content has changed
 *
 * The actual value is later taken from the browser location, this is purely a trigger.
 * @returns
 */
export const contentSetLocation = () => new Event(trigger.content.setLocation);

/**
 * Notifies that the content needs to scroll to the given location
 * @param target 0 for the top, or an #anchor tag
 * @returns
 */
export const contentScrollTo = (target: 0 | string) =>
	new CustomEvent(trigger.content.scrollTo, { detail: { target } });

/**
 * Notifies that data for the given reflection id is required and should be passed back into
 * the given callback function
 * @param id
 * @param callBack
 * @returns
 */
export const fetchReflectionById = (
	id: number,
	callBack: (reflection: YAFDataObject) => void
) =>
	new CustomEvent(trigger.fetch.reflectionById, {
		detail: { id, callBack },
	});

export const getReflectionById = (
	id: number,
	callBack: (test: number) => void
) =>
	new CustomEvent(trigger.get.reflectionLinkById, {
		detail: { id, callBack },
	});

export const rollMenuDown = () => new Event(trigger.content.rollMenuDown);
export const rollMenuUp = () => new Event(trigger.content.rollMenuUp);
