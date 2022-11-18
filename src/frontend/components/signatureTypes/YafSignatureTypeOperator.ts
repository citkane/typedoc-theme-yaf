import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureTypeOperator extends YafElement {
	props!: JSONOutput.TypeOperatorType;
	constructor() {
		super(yafSignatureTypeOperator);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureTypeOperator = 'yaf-signature-type-operator';
customElements.define(yafSignatureTypeOperator, YafSignatureTypeOperator);
