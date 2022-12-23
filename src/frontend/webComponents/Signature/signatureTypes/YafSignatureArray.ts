import { componentName } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../../index.js';
import {
	makeSymbolSpan,
	needsParenthesis,
	renderSignatureType,
} from '../../../yafElement.js';

export class YafSignatureArray extends YafHTMLElement<JSONOutput.ArrayType> {
	array = 'array';
	onConnect() {
		const { elementType } = this.props;

		const HTMLElements = [
			renderSignatureType(elementType, 'arrayElement'),
			makeSymbolSpan('[]'),
		];
		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}

		this.appendChildren(HTMLElements);
	}
}
const yafSignatureArray: componentName = 'yaf-signature-array';
customElements.define(yafSignatureArray, YafSignatureArray);
