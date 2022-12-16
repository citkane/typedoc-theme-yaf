import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, renderSignatureType } = yafElement;

export class YafSignatureTypeOperator extends HTMLElement {
	props!: JSONOutput.TypeOperatorType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { operator, target } = this.props;
		const HTMLElements = [
			makeSymbolSpan(`${operator} `),
			renderSignatureType(target, 'typeOperatorTarget'),
		];

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const yafSignatureTypeOperator = 'yaf-signature-type-operator';
customElements.define(yafSignatureTypeOperator, YafSignatureTypeOperator);
