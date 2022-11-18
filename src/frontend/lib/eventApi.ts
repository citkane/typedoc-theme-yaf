import {
	contentScrollTo,
	contentSetLocation,
	fetchReflectionById,
	getReflectionById,
	rollMenuDown,
	rollMenuUp,
} from './events.js';
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
	},
};

export const event = {
	content: {
		setLocation: contentSetLocation,
		scrollTo: contentScrollTo,
		rollMenuDown: rollMenuDown,
		rollMenuUp: rollMenuUp,
	},
	fetch: {
		reflectionById: fetchReflectionById,
	},
	get: {
		reflectionLinkById: getReflectionById,
	},
};
