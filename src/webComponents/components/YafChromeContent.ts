import { componentName } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';
import { eventType } from '../lib/eventApi.js';

const componentName: componentName = 'yaf-chrome-content';
const body = document.querySelector('body') as HTMLBodyElement;

export class YafChromeContent extends YAFElement {
	constructor() {
		super(componentName);
	}
	async connectedCallback() {
		body.addEventListener(
			eventType.content.scrollTo,
			this.scrollToPlace as EventListener
		);
		const html = await this.fetchTemplate('html');
		const css = await this.fetchTemplate('css');
		const innerHtml = this.makeContent(html);
		const innerCss = this.makeElement(css);
		this.appendChild(innerCss);
		this.appendChild(innerHtml);
	}

	disconnectedCallback() {
		body.removeEventListener(
			eventType.content.scrollTo,
			this.scrollToPlace as EventListener
		);
	}
	scrollToPlace = (e: CustomEvent) => {
		this.scrollTo(0, e.detail.target);
	};
}
customElements.define(componentName, YafChromeContent);
