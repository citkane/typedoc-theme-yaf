import {
	contentScrollTo,
	contentSetLocation,
	fetchReflectionById,
} from './events.js';
export const eventType = {
	content: {
		setLocation: 'yaf.content.setLocation',
		scrollTo: 'yaf.content.scrollTo',
	},
	fetch: {
		reflectionById: 'yaf.fetch.reflectionById',
	},
};

export const eventConstruct = {
	content: {
		setLocation: contentSetLocation,
		scrollTo: contentScrollTo,
	},
	fetch: {
		reflectionById: fetchReflectionById,
	},
};
