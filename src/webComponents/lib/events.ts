/**
 * Something about events here
 *
 * @module
 */

import { YAFDataObject } from '../types.js';
import { eventType } from './eventApi.js';

export const contentSetLocation = () =>
	new Event(eventType.content.setLocation);

export const contentScrollTo = (target: 0 | string) =>
	new CustomEvent(eventType.content.scrollTo, { detail: { target } });

export const fetchReflectionById = (
	id: number,
	callBack: (reflection: YAFDataObject) => void
) =>
	new CustomEvent(eventType.fetch.reflectionById, {
		detail: { id, callBack },
	});
