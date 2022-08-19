import { yafEvents } from '../events.js';
import { componentName } from '../types';
import { YAFElement } from '../YAFElement.js';

const body = document.querySelector('body') as HTMLBodyElement;

const componentName: componentName = 'yaf-navigation-link';
export class NavigationLink extends YAFElement {
	link: HTMLAnchorElement;
	baseUrl: string;
	constructor() {
		super(componentName);
		this.link = document.createElement('a');
		this.baseUrl = `${window.location.origin}${window.location.pathname}`;
	}
	connectedCallback() {
		this.getAttribute('href') === '/' &&
			this.setAttribute('href', this.baseUrl);
		const targetURL = this.targetURL();
		targetURL.origin !== window.location.origin &&
			this.link.setAttribute('target', '_blank');

		this.link.innerHTML = this.innerHTML;
		this.link.setAttribute('href', targetURL.href);
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
		window.history.pushState({ path: this.link.href }, '', this.link.href);
		const changeLocationEvent = new Event(yafEvents.content.setLocation);
		body.dispatchEvent(changeLocationEvent);
	};
	targetURL = () => new URL(this.getAttribute('href') || '', this.baseUrl);
}

customElements.define(componentName, NavigationLink);
