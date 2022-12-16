import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, renderSignatureType } = yafElement;

export class YafSignatureQuery extends HTMLElement {
	props!: JSONOutput.QueryType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { queryType } = this.props;
		const HTMLElements = [
			makeSymbolSpan('typeof '),
			renderSignatureType(queryType, 'queryTypeTarget'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureQuery = 'yaf-signature-query';
customElements.define(yafSignatureQuery, YafSignatureQuery);
