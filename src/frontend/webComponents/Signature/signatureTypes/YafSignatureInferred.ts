import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';

export class YafSignatureInferred extends HTMLElement {
	props!: JSONOutput.InferredType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureinferred = 'yaf-signature-inferred';
customElements.define(yafSignatureinferred, YafSignatureInferred);
