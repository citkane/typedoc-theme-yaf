import { componentName } from '../types.js';
import { YafElement } from '../YafElement.js';
import { trigger } from '../lib/eventApi.js';

const yafChromeContentName: componentName = 'yaf-chrome-content';

/**
 * @group test
 */
export class YafChromeContent extends YafElement {
	constructor() {
		super(yafChromeContentName);
	}
	async connectedCallback() {
		this.body.addEventListener(
			trigger.content.scrollTo,
			this.scrollToPlace as EventListener
		);
		const html = await this.fetchTemplate('html');
		//const css = await this.fetchTemplate('css');
		const innerHtml = this.makeContent(html);
		//const innerCss = this.makeElement(css);
		//this.appendChild(innerCss);
		this.appendChild(innerHtml);
	}

	disconnectedCallback() {
		this.body.removeEventListener(
			trigger.content.scrollTo,
			this.scrollToPlace as EventListener
		);
	}
	scrollToPlace = (e: CustomEvent) => {
		this.scrollTo(0, e.detail.target);
	};
}
customElements.define(yafChromeContentName, YafChromeContent);

const yafChromeLeftName: componentName = 'yaf-chrome-left';

/**
 *
 */
export class YafChromeLeft extends YafElement {
	constructor() {
		super(yafChromeLeftName);
	}
	async connectedCallback() {
		const html = await this.fetchTemplate('html');
		//const css = await this.fetchTemplate('css');
		const innerHtml = this.makeContent(html);
		//const innerCss = this.makeElement(css);
		//this.appendChild(innerCss);
		this.appendChild(innerHtml);
	}
}
customElements.define(yafChromeLeftName, YafChromeLeft);
