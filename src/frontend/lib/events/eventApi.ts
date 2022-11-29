import * as actions from './eventFunctions.js';

export const trigger = {
	content: {
		setLocation: 'yaf.content.setLocation',
		scrollTo: 'yaf.content.scrollTo',
		rollMenuDown: 'yaf.content.rollMenuDown',
		rollMenuUp: 'yaf.content.rollMenuUp',
	},
	fetch: {
		reflectionById: 'yaf.fetch.reflectionById',
	},
	get: {
		reflectionLinkById: 'yaf.get.reflectionLinkById',
		pageContentId: 'yaf.get.pageContentId',
	},
};

class Events {
	trigger = trigger;
	action = {
		content: {
			setLocation: actions.contentSetLocation,
			scrollTo: actions.contentScrollTo,
			rollMenuDown: actions.rollMenuDown,
			rollMenuUp: actions.rollMenuUp,
		},
		fetch: {
			reflectionById: actions.fetchReflectionById,
		},
		get: {
			reflectionLinkById: actions.getReflectionById,
			pageContentId: actions.getPageContentId,
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
