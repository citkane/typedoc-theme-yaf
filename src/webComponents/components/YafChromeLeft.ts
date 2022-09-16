import { componentName } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';

const componentName: componentName = 'yaf-chrome-left';

export class YafChromeLeft extends YAFElement {
	constructor() {
		super(componentName);
	}
	async connectedCallback() {
		const html = await this.fetchTemplate('html');
		const css = await this.fetchTemplate('css');
		const innerHtml = this.makeContent(html);
		const innerCss = this.makeElement(css);
		this.appendChild(innerCss);
		this.appendChild(innerHtml);
	}
}
customElements.define(componentName, YafChromeLeft);
