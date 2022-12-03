import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignatureRest extends HTMLElement {
	props!: JSONOutput.RestType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureRest = 'yaf-signature-rest';
customElements.define(yafSignatureRest, YafSignatureRest);
