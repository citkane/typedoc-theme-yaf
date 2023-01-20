import { scrollTo } from './index.js';
import { trigger } from './triggers.js';

export const rollMenuDown = () => new Event(trigger.menu.rollMenuDown);
export const rollMenuUp = () => new Event(trigger.menu.rollMenuUp);
export type toggle = {
	state?: 'open' | 'close';
};
export const toggle = (state?: toggle['state']) =>
	new CustomEvent<toggle>(trigger.menu.toggle, {
		detail: { state },
	});

export interface menu {
	/**
	 * Scrolls the main navigation menu to the given id.
	 */
	scrollTo: scrollTo;
	/**
	 * Expands all drawers of the main navigation menu
	 */
	rollMenuDown: null;
	/**
	 * Contracts all drawers of the main navigation menu
	 */
	rollMenuUp: null;
	/**
	 * Toggle the open/close state of the main navigation menu in mobile views
	 */
	toggle: toggle;
}
