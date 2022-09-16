import { componentName } from '../types';
import { YAFElement } from '../lib/YafElement.js';
import { JSONOutput } from 'typedoc';

const componentName: componentName = 'yaf-content-signature-literal';

export class YafContentSignatureLiteral extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <JSONOutput.LiteralType>this.props;
	connectedCallback() {
		const inner = this.needsParenthesis()
			? `<span class="symbol>(</span>${this.props.value}<span class="symbol>)</span>`
			: this.props.value;
		const newElement = this.makeElement(
			`<span class="type">${inner}</span>`
		);
		this.parentElement?.replaceChild(newElement, this);
	}
}
customElements.define(componentName, YafContentSignatureLiteral);
