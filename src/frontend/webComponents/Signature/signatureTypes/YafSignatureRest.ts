import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, renderSignatureType } = yafElement;

export class YafSignatureRest extends HTMLElement {
	props!: JSONOutput.RestType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { elementType } = this.props;

		const HTMLElements = [
			makeSymbolSpan('...'),
			renderSignatureType(elementType, 'restElement'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureRest = 'yaf-signature-rest';
customElements.define(yafSignatureRest, YafSignatureRest);
