import { componentName, debouncer } from '../../../../types/frontendTypes.js';
import { JSONOutput } from 'typedoc';
import yafElement from '../../../yafElement.js';
const { debounce, makeSymbolSpan, makeLiteralSpan, renderSignatureType } =
	yafElement;

export class YafSignatureTemplateLiteral extends HTMLElement {
	props!: JSONOutput.TemplateLiteralType;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const { head, tail } = this.props;
		const HTMLElements = [makeSymbolSpan('`')];
		if (head) HTMLElements.push(makeLiteralSpan(head));
		tail.map((item) => {
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
			.flat()
			.forEach((element) => HTMLElements.push(element));
		HTMLElements.push(makeSymbolSpan('`'));

		HTMLElements.forEach((item) => this.appendChild(item));
	}
}

const componentName: componentName = 'yaf-signature-template-literal';
customElements.define(componentName, YafSignatureTemplateLiteral);
