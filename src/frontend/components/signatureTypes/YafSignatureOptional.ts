import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureOptional extends YafElement {
	props!: JSONOutput.OptionalType;
	constructor() {
		super(yafSignatureOptional);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureOptional = 'yaf-signature-optional';
customElements.define(yafSignatureOptional, YafSignatureOptional);
