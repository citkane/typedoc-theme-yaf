import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';

export class YafSignatureTypeOperator extends HTMLElement {
	props!: JSONOutput.TypeOperatorType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { operator, target } = this.props;
		this.appendChild(yafElement.makeSymbolSpan(`${operator} `));
		this.appendChild(
			yafElement.renderSignatureType(target, 'typeOperatorTarget')
		);
	}
}

const yafSignatureTypeOperator = 'yaf-signature-type-operator';
customElements.define(yafSignatureTypeOperator, YafSignatureTypeOperator);
