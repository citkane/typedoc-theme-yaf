import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import { makeSymbolSpan, renderSignatureType } from '../../../yafElement.js';

export class YafSignatureQuery extends YafHTMLElement<JSONOutput.QueryType> {
	onConnect() {
		const { queryType } = this.props;
		const HTMLElements = [
			makeSymbolSpan('typeof '),
			renderSignatureType(queryType, 'queryTypeTarget'),
		];

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureQuery = 'yaf-signature-query';
customElements.define(yafSignatureQuery, YafSignatureQuery);
