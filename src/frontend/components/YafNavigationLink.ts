import { clickEvent, componentName } from '../../types/types';
import events from '../lib/events/eventApi.js';
import router from '../lib/router.js';

export class YafNavigationLink extends HTMLAnchorElement {
	linkElement = document.createElement('a');

	connectedCallback() {
		if (this.getAttribute('href') === '/')
			this.setAttribute('href', router.baseUrl);

		const targetURL = router.getTargetURL(this);
		if (targetURL.origin !== window.location.origin)
			this.setAttribute('target', '_blank');

		this.setAttribute('href', encodeURI(targetURL.href));
		events.on('click', (e: clickEvent) => router.route(this, e), this);
	}
	disconnectedCallback() {
		events.off('click', (e: clickEvent) => router.route(this, e), this);
	}
}
const yafNavigationLink: componentName = 'yaf-navigation-link';
customElements.define(yafNavigationLink, YafNavigationLink, { extends: 'a' });
