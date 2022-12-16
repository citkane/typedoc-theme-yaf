import { JSONOutput } from 'typedoc';
import { debouncer } from '../../../../types/frontendTypes.js';
import yafElement from '../../../yafElement.js';
const { debounce, renderSignatureType, makeSymbolSpan } = yafElement;

export class YafSignatureConditional extends HTMLElement {
	props!: JSONOutput.ConditionalType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { checkType, extendsType, falseType, trueType } = this.props;

		const HTMLElements = [
			renderSignatureType(checkType, 'conditionalCheck'),
			makeSymbolSpan(' extends '),
			renderSignatureType(extendsType, 'conditionalExtends'),
			makeSymbolSpan(' ? '),
			renderSignatureType(trueType, 'conditionalTrue'),
			makeSymbolSpan(' : '),
			renderSignatureType(falseType, 'conditionalFalse'),
		];

		HTMLElements.forEach((element: HTMLElement) =>
			this.appendChild(element)
		);
	}
}

const yafSignatureConditional = 'yaf-signature-conditional';
customElements.define(yafSignatureConditional, YafSignatureConditional);
