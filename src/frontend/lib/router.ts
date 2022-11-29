/**
 * @module Frontend
 */

import { clickEvent } from '../../types/types.js';
import events from './events/eventApi.js';
import { YafNavigationLink } from '../components/YafNavigationLink.js';

const { action } = events;

class Router {
	baseUrl = `${window.location.origin}${window.location.pathname}`;

	route = (link: YafNavigationLink, e: clickEvent) => {
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
			this.getHrefWithoutHash(window.location.href) ===
			this.getHrefWithoutHash(href)
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

	getTargetURL = (link: YafNavigationLink) =>
		new URL(link.getAttribute('href') || '', this.baseUrl);

	private getHrefWithoutHash = (href: string | null) =>
		href ? href.split('#')[0] : href;

	private getHash = (href: string | null) => {
		if (!href) return 0;
		const hash = href.split('#')[1];
		return hash || 0;
	};
}

const router = new Router();
export default router;
