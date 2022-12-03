import { yafOptions } from '../../../types/frontendTypes.js';
import * as actions from './eventFunctions.js';

const options: Record<yafOptions, string> = {
	showInheritedMembers: 'yaf.options.showInheritedMembers',
};

export const trigger = {
	content: {
		setLocation: 'yaf.content.setLocation',
		scrollTo: 'yaf.content.scrollTo',
	},
	menu: {
		rollMenuDown: 'yaf.menu.rollMenuDown',
		rollMenuUp: 'yaf.menu.rollMenuUp',
		scrollTo: 'yaf.menu.scrollTo',
	},
	drawers: {
		refreshHeight: 'yaf.drawer.refreshHeight',
		initHeight: 'yaf.drawer.refreshHeight',
		resetHeight: 'yaf.drawer.resetHeight',
	},
	fetch: {
		reflectionById: 'yaf.fetch.reflectionById',
	},
	get: {
		reflectionLinkById: 'yaf.get.reflectionLinkById',
		pageContentId: 'yaf.get.pageContentId',
	},
	options,
};

class Events {
	trigger = trigger;
	action = {
		content: {
			setLocation: actions.contentSetLocation,
			scrollTo: actions.scrollTo.bind(null, 'content'),
		},
		menu: {
			rollMenuDown: actions.rollMenuDown,
			rollMenuUp: actions.rollMenuUp,
			scrollTo: actions.scrollTo.bind(null, 'menu'),
		},
		drawers: {
			refreshHeight: actions.sendDrawerHeight.bind(null, 'refreshHeight'),
			initHeight: actions.sendDrawerHeight.bind(null, 'initHeight'),
			resetHeight: actions.resetDrawerHeight,
		},
		fetch: {
			reflectionById: actions.fetchReflectionById,
		},
		get: {
			reflectionLinkById: actions.getReflectionById,
			pageContentId: actions.getPageContentId,
		},
		options: {
			showInheritedMembers: actions.options.bind(
				null,
				'showInheritedMembers'
			),
		},
	};
	dispatch = (
		action: CustomEvent | Event,
		element: HTMLElement = this.body
	) => element.dispatchEvent(action);
	on = (
		trigger: string,
		callBack: unknown,
		element: HTMLElement | Window = this.body
	) => {
		element.addEventListener(trigger, callBack as EventListener);
	};
	off = (
		trigger: string,
		callBack: unknown,
		element: HTMLElement | Window = this.body
	) => {
		element.removeEventListener(trigger, callBack as EventListener);
	};
	body = document.querySelector('body') as HTMLBodyElement;
}

const events = new Events();
export default events;
