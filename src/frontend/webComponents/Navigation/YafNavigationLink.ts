import { clickEvent, componentName } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import events from '../../handlers/events/eventApi.js';
import router from '../../handlers/Router.js';
import { makeElement } from '../../yafElement.js';
import appState from '../../handlers/AppState.js';

export class YafNavigationLink extends YafHTMLElement {
	aHTMLElement!: HTMLAnchorElement;
	onConnect() {
		const { factory } = YafNavigationLink;
		this.aHTMLElement = makeElement<HTMLAnchorElement>(
			'a',
			[...this.classList].join(' ').trim()
		);

		if (this.getAttribute('href') === '/')
			this.setAttribute('href', router.baseUrl);
		let targetURL = router.getTargetURL(this);

		if (factory.isNumberPath(targetURL.pathname)) {
			const reflectionId = targetURL.pathname.replace(/^\//, '');
			const refelectionLink = appState.reflectionMap[reflectionId];

			console.log(reflectionId, refelectionLink);

			if (!refelectionLink) return;

			const hash = refelectionLink.fileName.endsWith(refelectionLink.name)
				? undefined
				: refelectionLink.name;

			this.setAttribute(
				'href',
				hash
					? `?page=${refelectionLink.fileName}#${hash}`
					: `?page=${refelectionLink.fileName}`
			);
			targetURL = router.getTargetURL(this);
		}

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
	private static factory = {
		isNumberPath: (path: string) => /^\/\d+$/.test(path),
	};
}
const yafNavigationLink: componentName = 'yaf-navigation-link';
customElements.define(yafNavigationLink, YafNavigationLink);
