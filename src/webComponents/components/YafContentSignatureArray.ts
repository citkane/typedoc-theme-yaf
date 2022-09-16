import { componentName } from '../types';
import { YAFElement } from '../lib/YafElement.js';
import { JSONOutput } from 'typedoc';

const componentName: componentName = 'yaf-content-signature-array';

export class YafContentSignatureArray extends YAFElement {
	constructor() {
		super(componentName);
	}
	props = <JSONOutput.ArrayType>this.props;
	connectedCallback() {
		const newElement = this.makeElement(`<span class="type" />`);
		this.needsParenthesis() &&
			newElement.appendChild(
				this.makeElement('<span class="symbol">(</span>')
			);
		newElement.appendChild(
			this.makeSignature(this.props.elementType, 'arrayElement')
		);
		newElement.appendChild(
			this.makeElement('<span class="symbol">[]</span>')
		);
		this.needsParenthesis() &&
			newElement.appendChild(
				this.makeElement('<span class="symbol">)</span>')
			);
		this.parentElement?.replaceChild(newElement, this);
	}
}
customElements.define(componentName, YafContentSignatureArray);
