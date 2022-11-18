import { event } from '../lib/eventApi.js';
import { componentName } from '../types';
import { YafElement } from '../YafElement.js';

const componentName: componentName = 'yaf-navigation-link';
export class YafNavigationLink extends YafElement {
	link: HTMLAnchorElement;
	baseUrl: string;
	constructor() {
		super(componentName);
		this.link = document.createElement('a');
		this.baseUrl = `${window.location.origin}${window.location.pathname}`;

		this.classList.forEach((className) =>
			this.link.classList.add(className)
		);
	}
	connectedCallback() {
		if (this.debounce()) return;

		this.getAttribute('href') === '/' &&
			this.setAttribute('href', this.baseUrl);
		const targetURL = this.targetURL();
		targetURL.origin !== window.location.origin &&
			this.link.setAttribute('target', '_blank');

		this.link.innerHTML = this.innerHTML;
		this.link.setAttribute('href', encodeURI(targetURL.href));
		this.link.addEventListener('click', (e) => this.linkRouter(e));
		this.parentNode?.replaceChild(this.link, this);
	}
	disconnectedCallback() {
		this.link.removeEventListener('click', (e) => this.linkRouter(e));
	}
	linkRouter = (e: Event) => {
		if (this.link.getAttribute('target') === '_blank') return; //execute link if external
		const origin = this.link.href.split('?')[0];
		if (origin && !window.location.href.startsWith(origin)) return; //execute link if different document set
		e.preventDefault(); //use internal routing for document partials
		if (window.location.href === this.link.href) return;
		window.history.pushState({ path: this.link.href }, '', this.link.href);
		//const changeLocationEvent = new Event(eventType.content.setLocation);
		this.body.dispatchEvent(event.content.setLocation());
	};
	targetURL = () => new URL(this.getAttribute('href') || '', this.baseUrl);
}

customElements.define(componentName, YafNavigationLink);
