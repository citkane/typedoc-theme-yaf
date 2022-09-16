import { componentName, htmlString } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';

const componentName: componentName = 'yaf-content-marked';
interface props {
	markedHtml: htmlString;
}
export class YafContentMarked extends YAFElement {
	markedHtml: htmlString;
	constructor() {
		super(componentName);
		this.markedHtml =
			this.props.markedHtml ||
			`<yaf-card-error>${componentName} requires the property 'markedHtml'</yaf-card-error>`;
	}
	props = <props>this.props;
	async connectedCallback() {
		this.classList.add('markdown-body');
		this.innerHTML = this.markedHtml;
	}
}
customElements.define(componentName, YafContentMarked);
