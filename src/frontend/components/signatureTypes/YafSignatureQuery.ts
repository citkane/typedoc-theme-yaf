import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureQuery extends YafElement {
	props!: JSONOutput.QueryType;
	constructor() {
		super(yafSignatureQuery);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureQuery = 'yaf-signature-query';
customElements.define(yafSignatureQuery, YafSignatureQuery);
