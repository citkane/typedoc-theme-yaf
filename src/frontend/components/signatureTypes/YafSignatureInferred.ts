import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureInferred extends YafElement {
	props!: JSONOutput.InferredType;
	constructor() {
		super(yafSignatureinferred);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureinferred = 'yaf-signature-inferred';
customElements.define(yafSignatureinferred, YafSignatureInferred);
