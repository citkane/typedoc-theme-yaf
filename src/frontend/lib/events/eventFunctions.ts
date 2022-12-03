import { yafOptions } from '../../../types/frontendTypes.js';
import { YAFDataObject } from '../../../types/types.js';
import { trigger } from './eventApi.js';

export const options = (context: yafOptions, value: unknown) =>
	new CustomEvent(trigger.options[context], { detail: value });

/**
 * Notifies the content or menu DOM that it needs to scroll to the given location
 * @param target
 * @param context
 * @returns
 */
export const scrollTo = (context: 'menu' | 'content', target: 0 | string) =>
	new CustomEvent(trigger[context].scrollTo, { detail: { target } });
/**
 * Notifies that the URL location for content has changed
 *
 * The actual value is later taken from the browser location, this is purely a trigger.
 * @returns
 */
export const contentSetLocation = () => new Event(trigger.content.setLocation);

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

export const getPageContentId = (callBack: (pageId: string) => void) =>
	new CustomEvent(trigger.get.pageContentId, {
		detail: { callBack },
	});

export const rollMenuDown = () => new Event(trigger.menu.rollMenuDown);
export const rollMenuUp = () => new Event(trigger.menu.rollMenuUp);

export const sendDrawerHeight = (
	action: 'refreshHeight' | 'initHeight',
	height: number
) => new CustomEvent(trigger.drawers[action], { detail: height });

export const resetDrawerHeight = () => new Event(trigger.drawers.resetHeight);
