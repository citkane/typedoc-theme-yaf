import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import {
	needsParenthesis,
	makeElement,
	makeSymbolSpan,
	stringify,
} from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';

export class YafContentSignatureLiteral extends YafHTMLElement<JSONOutput.LiteralType> {
	onConnect() {
		const { value } = this.props;
		const HTMLElements = [makeElement('span', null, stringify(value))];

		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}

		this.appendChildren(HTMLElements.flat());
	}
}

const componentName: componentName = 'yaf-signature-literal';
customElements.define(componentName, YafContentSignatureLiteral);
