import { JSONOutput } from 'typedoc';
import { componentName } from '../../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../../index.js';
import { makeSymbolSpan, renderSignatureType } from '../../../yafElement.js';

export class YafSignatureTypeOperator extends YafHTMLElement<JSONOutput.TypeOperatorType> {
	onConnect() {
		const { operator, target } = this.props;

		const HTMLElements = [
			makeSymbolSpan(`${operator} `),
			renderSignatureType(target, 'typeOperatorTarget'),
		];

		this.appendChildren(HTMLElements.flat());
	}
}

const yafSignatureTypeOperator: componentName = 'yaf-signature-type-operator';
customElements.define(yafSignatureTypeOperator, YafSignatureTypeOperator);
