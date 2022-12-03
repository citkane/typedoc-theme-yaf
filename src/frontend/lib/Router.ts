import events from './events/eventApi.js';
import { YafNavigationLink } from '../components/YafNavigationLink.js';
import { clickEvent } from '../../types/frontendTypes.js';

const { action } = events;

export default class Router {
	static baseUrl = `${window.location.origin}${window.location.pathname}`;

	static route = (link: YafNavigationLink, e: clickEvent) => {
		const href = link.getAttribute('href');
		const hrefOrigin = href ? href.split('?')[0] : href;
		const target = link.getAttribute('target') || undefined;

		if (
			!href ||
			target === '_blank' ||
			(hrefOrigin && !window.location.href.startsWith(hrefOrigin)) ||
			e.ctrlKey
		)
			return;

		e.preventDefault(); //use internal routing for document partials

		if (
			Router.getHrefWithoutHash(window.location.href) ===
			Router.getHrefWithoutHash(href)
		) {
			const hash = this.getHash(href);
			events.dispatch(action.content.scrollTo(hash));
			if (hash) {
				history.pushState('', '', `#${hash}`);
			} else {
				history.pushState({ path: href }, '', href);
			}
		} else {
			history.pushState({ path: href }, '', href);
			events.dispatch(action.content.setLocation());
		}
	};

	static getTargetURL = (link: YafNavigationLink) =>
		new URL(link.getAttribute('href') || '', this.baseUrl);

	private static getHrefWithoutHash = (href: string | null) =>
		href ? href.split('#')[0] : href;

	private static getHash = (href: string | null) => {
		if (!href) return 0;
		const hash = href.split('#')[1];
		return hash || 0;
	};
}
