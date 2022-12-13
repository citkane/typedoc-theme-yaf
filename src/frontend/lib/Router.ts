import { clickEvent } from '../../types/frontendTypes.js';
import { YafNavigationLink } from '../webComponents/Navigation/index.js';
import events from './events/eventApi.js';

const { action } = events;

export default class Router {
	static baseUrl = `${window.location.origin}${window.location.pathname}`;

	static route = (link: YafNavigationLink, e: clickEvent) => {
		const href = link.getAttribute('href');
		const hrefOrigin = href ? href.split('?')[0] : href;
		const target = link.getAttribute('target') || undefined;

		const isExternalLink =
			!href ||
			target === '_blank' ||
			(hrefOrigin && !window.location.href.startsWith(hrefOrigin)) ||
			e.ctrlKey;

		if (isExternalLink) return;
		e.preventDefault();

		const linkIsOnCurrentPage =
			Router.getHrefWithoutHash(window.location.href) ===
			Router.getHrefWithoutHash(href);
		if (linkIsOnCurrentPage) {
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
