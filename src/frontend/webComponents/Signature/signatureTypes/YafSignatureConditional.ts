import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import { renderSignatureType, makeSymbolSpan } from '../../../yafElement.js';

export class YafSignatureConditional extends YafHTMLElement<JSONOutput.ConditionalType> {
	onConnect() {
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

		this.appendChildren(HTMLElements);
	}
}

const yafSignatureConditional = 'yaf-signature-conditional';
customElements.define(yafSignatureConditional, YafSignatureConditional);
