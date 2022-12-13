import { JSONOutput } from 'typedoc';
import yafElement from '../../../YafElement.js';

export class YafSignatureConditional extends HTMLElement {
	props!: JSONOutput.ConditionalType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		console.log(this.props);

		const { checkType, extendsType, falseType, trueType } = this.props;

		this.appendChild(
			yafElement.renderSignatureType(checkType, 'conditionalCheck')
		);
		this.appendChild(yafElement.makeSymbolSpan(' extends '));
		this.appendChild(
			yafElement.renderSignatureType(extendsType, 'conditionalExtends')
		);
		this.appendChild(yafElement.makeSymbolSpan(' ? '));
		this.appendChild(
			yafElement.renderSignatureType(trueType, 'conditionalTrue')
		);
		this.appendChild(yafElement.makeSymbolSpan(' : '));
		this.appendChild(
			yafElement.renderSignatureType(falseType, 'conditionalFalse')
		);
	}
}

const yafSignatureConditional = 'yaf-signature-conditional';
customElements.define(yafSignatureConditional, YafSignatureConditional);
