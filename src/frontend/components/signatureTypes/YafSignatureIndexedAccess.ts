import { JSONOutput } from 'typedoc';
import { YafElement } from '../../YafElement.js';

export class YafSignatureIndexedAccess extends YafElement {
	props!: JSONOutput.IndexedAccessType;
	constructor() {
		super(yafSignatureIndexedAccess);
	}
	connectedCallback() {
		if (this.debounce()) return;
		console.log(this.props);
	}
}

const yafSignatureIndexedAccess = 'yaf-signature-indexed-access';
customElements.define(yafSignatureIndexedAccess, YafSignatureIndexedAccess);
