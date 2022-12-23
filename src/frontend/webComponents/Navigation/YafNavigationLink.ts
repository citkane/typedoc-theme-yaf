import { clickEvent, componentName } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import events from '../../lib/events/eventApi.js';
import router from '../../lib/Router.js';
import { makeElement } from '../../yafElement.js';

export class YafNavigationLink extends YafHTMLElement {
	aHTMLElement!: HTMLAnchorElement;
	onConnect() {
		this.aHTMLElement = makeElement<HTMLAnchorElement>(
			'a',
			[...this.classList].join(' ').trim()
		);

		if (this.getAttribute('href') === '/')
			this.setAttribute('href', router.baseUrl);
		const targetURL = router.getTargetURL(this);
		if (targetURL.origin !== window.location.origin)
			this.setAttribute('target', '_blank');
		this.setAttribute('href', encodeURI(targetURL.href));

		this.getAttributeNames().forEach((name) => {
			const value = this.getAttribute(name);
			if (value) this.aHTMLElement.setAttribute(name, value);
		});

		this.aHTMLElement.replaceChildren(...[...this.childNodes]);
		this.replaceChildren(this.aHTMLElement);

		events.on(
			'click',
			(e: clickEvent) => router.route(this, e),
			this.aHTMLElement
		);
	}
	disconnectedCallback() {
		events.off(
			'click',
			(e: clickEvent) => router.route(this, e),
			this.aHTMLElement
		);
	}
}
const yafNavigationLink: componentName = 'yaf-navigation-link';
customElements.define(yafNavigationLink, YafNavigationLink);
