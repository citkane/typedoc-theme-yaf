import { JSONOutput } from 'typedoc';
import yafElement from '../../YafElement.js';

export class YafSignatureQuery extends HTMLElement {
	props!: JSONOutput.QueryType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);
	}
}

const yafSignatureQuery = 'yaf-signature-query';
customElements.define(yafSignatureQuery, YafSignatureQuery);
