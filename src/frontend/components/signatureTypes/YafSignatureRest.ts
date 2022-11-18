import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureRest extends YafElement {
	props!: JSONOutput.RestType;
	constructor() {
		super(yafSignatureRest);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureRest = 'yaf-signature-rest';
customElements.define(yafSignatureRest, YafSignatureRest);
