import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureConditional extends YafElement {
	props!: JSONOutput.ConditionalType;
	constructor() {
		super(yafSignatureConditional);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureConditional = 'yaf-signature-conditional';
customElements.define(yafSignatureConditional, YafSignatureConditional);
