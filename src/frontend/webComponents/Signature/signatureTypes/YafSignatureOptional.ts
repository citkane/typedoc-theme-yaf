import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, renderSignatureType, makeSymbolSpan } = yafElement;

export class YafSignatureOptional extends HTMLElement {
	props!: JSONOutput.OptionalType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { elementType } = this.props;
		const HTMLElements = [
			renderSignatureType(elementType, 'optionalElement'),
			makeSymbolSpan('?'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureOptional = 'yaf-signature-optional';
customElements.define(yafSignatureOptional, YafSignatureOptional);
