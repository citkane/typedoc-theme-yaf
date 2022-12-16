import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, needsParenthesis, renderSignatureType } =
	yafElement;

export class YafSignatureArray extends HTMLElement {
	props!: JSONOutput.ArrayType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { elementType } = this.props;

		const HTMLElements = [
			renderSignatureType(elementType, 'arrayElement'),
			makeSymbolSpan('[]'),
		];
		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}
const yafSignatureArray: componentName = 'yaf-signature-array';
customElements.define(yafSignatureArray, YafSignatureArray);
