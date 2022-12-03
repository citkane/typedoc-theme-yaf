import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignatureConditional extends HTMLElement {
	props!: JSONOutput.ConditionalType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureConditional = 'yaf-signature-conditional';
customElements.define(yafSignatureConditional, YafSignatureConditional);
