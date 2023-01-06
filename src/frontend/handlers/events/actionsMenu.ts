import { scrollTo } from './index.js';
import { trigger } from './triggers.js';

export const rollMenuDown = () => new Event(trigger.menu.rollMenuDown);
export const rollMenuUp = () => new Event(trigger.menu.rollMenuUp);

export interface menu {
	scrollTo: scrollTo;
	rollMenuDown: null;
	rollMenuUp: null;
}
