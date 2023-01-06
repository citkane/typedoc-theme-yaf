import { trigger } from './triggers.js';

export const resetDrawerHeight = () => new Event(trigger.drawers.resetHeight);

export interface drawers {
	resetDrawerHeight: null;
}
