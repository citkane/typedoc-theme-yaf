/**
 *
 */
import { componentName, htmlString } from '../types.js';
import { YafElement } from '../YafElement.js';

export class YafContentMarked extends YafElement {
	props!: htmlString | undefined;
	constructor() {
		super(yafContentMarked);
	}
	async connectedCallback() {
		if (!this.props) return;
		this.classList.add('markdown-body');
		this.innerHTML = this.props;
	}
}

const yafContentMarked: componentName = 'yaf-content-marked';
customElements.define(yafContentMarked, YafContentMarked);
