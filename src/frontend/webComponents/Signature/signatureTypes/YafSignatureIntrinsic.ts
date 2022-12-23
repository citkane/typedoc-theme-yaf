import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';

import {
	needsParenthesis,
	makeTypeSpan,
	makeSymbolSpan,
} from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';

export class YafContentSignatureIntrinsic extends YafHTMLElement<JSONOutput.IntrinsicType> {
	onConnect() {
		const { name } = this.props;
		const HTMLElements = [makeTypeSpan(name)];

		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}
		this.appendChildren(HTMLElements.flat());
	}
}

const componentName: componentName = 'yaf-signature-intrinsic';
customElements.define(componentName, YafContentSignatureIntrinsic);
