import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, needsParenthesis, makeTypeSpan, makeSymbolSpan } = yafElement;

export class YafContentSignatureIntrinsic extends HTMLElement {
	props!: JSONOutput.IntrinsicType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { name } = this.props;
		const HTMLElements = [makeTypeSpan(name)];

		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}
		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const componentName: componentName = 'yaf-signature-intrinsic';
customElements.define(componentName, YafContentSignatureIntrinsic);
