import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import { renderSignatureType, makeSymbolSpan } from '../../../yafElement.js';

export class YafSignatureOptional extends YafHTMLElement<JSONOutput.OptionalType> {
	onConnect() {
		const { elementType } = this.props;
		const HTMLElements = [
			renderSignatureType(elementType, 'optionalElement'),
			makeSymbolSpan('?'),
		];

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureOptional = 'yaf-signature-optional';
customElements.define(yafSignatureOptional, YafSignatureOptional);
