import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';

export class YafSignatureOptional extends HTMLElement {
	props!: JSONOutput.OptionalType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureOptional = 'yaf-signature-optional';
customElements.define(yafSignatureOptional, YafSignatureOptional);
