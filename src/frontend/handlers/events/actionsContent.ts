import { trigger } from './triggers.js';
import { scrollTo } from './index.js';
/**
 * Notifies that the URL location for content has changed
 *
 * The actual value is later taken from the browser location, this is purely a trigger.
 * @returns
 */
export const setLocation = () => new Event(trigger.content.setLocation);

export type scrollTop = { scrollTop: number };
export const scrollTop = (scrollTop: scrollTop['scrollTop']) =>
	new CustomEvent<scrollTop>(trigger.content.scrollTop, {
		detail: { scrollTop },
	});

export type getPageId = { callBack: (pageId: number) => void };
export const getPageId = (callBack: getPageId['callBack']) =>
	new CustomEvent<getPageId>(trigger.content.getPageId, {
		detail: { callBack },
	});

export type breadcrumb = { id: number };
export const breadcrumb = (id: breadcrumb['id']) =>
	new CustomEvent<breadcrumb>(trigger.content.breadcrumb, { detail: { id } });

export interface content {
	scrollTo: scrollTo;
	scrollTop: scrollTop;
	getPageId: getPageId;
	breadcrumb: breadcrumb;
}
