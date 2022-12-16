import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, needsParenthesis, makeElement, makeSymbolSpan, stringify } =
	yafElement;

export class YafContentSignatureLiteral extends HTMLElement {
	props!: JSONOutput.LiteralType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { value } = this.props;
		const HTMLElements = [makeElement('span', null, stringify(value))];

		if (needsParenthesis(this)) {
			HTMLElements.unshift(makeSymbolSpan('('));
			HTMLElements.push(makeSymbolSpan(')'));
		}

		HTMLElements.forEach((element) => this.appendChild(element));
	}
}

const componentName: componentName = 'yaf-signature-literal';
customElements.define(componentName, YafContentSignatureLiteral);
