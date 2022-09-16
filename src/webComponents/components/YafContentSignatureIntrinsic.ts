import { componentName } from '../types';
import { YAFElement } from '../lib/YafElement.js';
import { JSONOutput } from 'typedoc';

const componentName: componentName = 'yaf-content-signature-intrinsic';

export class YafContentSignatureIntrinsic extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <JSONOutput.IntrinsicType>this.props;
	connectedCallback() {
		const inner = this.needsParenthesis()
			? `<span class="symbol>(</span>${this.props.name}<span class="symbol>)</span>`
			: this.props.name;
		const newElement = this.makeElement(
			`<span class="type">${inner}</span>`
		);
		this.parentElement?.replaceChild(newElement, this);
	}
}
customElements.define(componentName, YafContentSignatureIntrinsic);
