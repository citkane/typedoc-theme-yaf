import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignatureIndexedAccess extends HTMLElement {
	props!: JSONOutput.IndexedAccessType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureIndexedAccess = 'yaf-signature-indexed-access';
customElements.define(yafSignatureIndexedAccess, YafSignatureIndexedAccess);
