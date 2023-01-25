import { clickEvent, componentName } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import router from '../../handlers/Router.js';
import { makeElement } from '../../yafElement.js';
import appState from '../../handlers/AppState.js';
import { events } from '../../handlers/index.js';

export class YafNavigationLink extends YafHTMLElement {
	aHTMLElement!: HTMLAnchorElement;
	onConnect() {
		this.aHTMLElement = makeElement<HTMLAnchorElement>('a');
		this.classList.forEach((className) => {
			this.aHTMLElement.classList.add(className);
			this.classList.remove(className);
		});

		const Href = this.getAttribute('href');
		if (Href === '/') this.setAttribute('href', router.baseUrl);
		let targetURL = router.getTargetURL(this);

		if (!isNaN(Number(Href))) {
			const reflectionLink = appState.reflectionMap[Href!];

			if (!reflectionLink) return;

			const { query, hash } = reflectionLink;

			this.setAttribute(
				'href',
				hash ? `?page=${query}#${hash}` : `?page=${query}`
			);
			targetURL = router.getTargetURL(this);
		}

		if (targetURL.origin !== window.location.origin) {
			this.setAttribute('target', '_blank');
		}
		this.setAttribute('href', encodeURI(targetURL.href));

		this.getAttributeNames().forEach((name) => {
			const value = this.getAttribute(name);
			if (value) {
				this.aHTMLElement.setAttribute(name, value);
			}
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
