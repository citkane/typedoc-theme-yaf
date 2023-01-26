import * as actions from './index.js';
import { trigger } from './triggers.js';

export class Events {
	trigger = trigger;
	action = {
		content: {
			setLocation: actions.content.setLocation,
			scrollTo: actions.scrollTo.bind(null, 'content'),
			scrollTop: actions.content.scrollTop,
			getPageId: actions.content.getPageId,
			breadcrumb: actions.content.breadcrumb,
		},
		menu: {
			rollMenuDown: actions.menu.rollMenuDown,
			rollMenuUp: actions.menu.rollMenuUp,
			scrollTo: actions.scrollTo.bind(null, 'menu'),
			toggle: actions.menu.toggle,
			search: actions.menu.search,
		},
		drawers: {
			resetHeight: actions.drawers.resetDrawerHeight,
		},
		options: {
			display: actions.options.display,
		},
	};
	dispatch = (
		action: CustomEvent | Event,
		element: HTMLElement = Events.body
	) => element.dispatchEvent(action);
	on = (
		trigger: string,
		callBack: unknown,
		element: HTMLElement | Window = Events.body
	) => {
		element.addEventListener(trigger, callBack as EventListener);
	};
	off = (
		trigger: string,
		callBack: unknown,
		element: HTMLElement | Window = Events.body
	) => {
		element.removeEventListener(trigger, callBack as EventListener);
	};

	private static body = document.querySelector('body') as HTMLBodyElement;
}

const events = new Events();
export default events;
