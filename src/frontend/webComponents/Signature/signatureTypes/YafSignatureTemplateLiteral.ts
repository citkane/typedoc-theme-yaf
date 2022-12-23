import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import {
	makeSymbolSpan,
	makeLiteralSpan,
	renderSignatureType,
} from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';

export class YafSignatureTemplateLiteral extends YafHTMLElement<JSONOutput.TemplateLiteralType> {
	onConnect() {
		const { head, tail } = this.props;
		const { factory } = YafSignatureTemplateLiteral;

		const HTMLElements = [
			makeSymbolSpan('`'),
			head ? makeLiteralSpan(head) : undefined,
			factory.tail(tail),
			makeSymbolSpan('`'),
		];

		this.appendChildren(HTMLElements.flat());
	}

	private static factory = {
		tail: (tail: JSONOutput.TemplateLiteralType['tail']) =>
			tail
				.map((item) => {
					const tailElements = [
						makeSymbolSpan('${'),
						renderSignatureType(item[0], 'templateLiteralElement'),
						makeSymbolSpan('}'),
					];
					if (item[1]) {
						tailElements.push(makeLiteralSpan(item[1]));
					}
					return tailElements;
				})
				.flat(),
	};
}

const componentName: componentName = 'yaf-signature-template-literal';
customElements.define(componentName, YafSignatureTemplateLiteral);
