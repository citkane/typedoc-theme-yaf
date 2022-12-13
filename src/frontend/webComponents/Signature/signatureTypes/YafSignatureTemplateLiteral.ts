import { componentName } from '../../../../types/frontendTypes.js';
import yafElement from '../../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafSignatureTemplateLiteral extends HTMLElement {
	props!: JSONOutput.TemplateLiteralType;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { head, tail } = this.props;

		let items = [yafElement.makeSymbolSpan('`')];
		head && items.push(yafElement.makeLiteralSpan(head));
		tail.forEach((item) => {
			items.push(yafElement.makeSymbolSpan('${'));

			const type = yafElement.renderSignatureType(
				item[0],
				'templateLiteralElement'
			);
			type.classList.add('type');
			items.push(type);
			items.push(yafElement.makeSymbolSpan('}'));
			if (item[1]) {
				const span = yafElement.makeLiteralSpan('');
				span.innerText = item[1];
				items.push(span);
			}
		});

		items = [...items, yafElement.makeSymbolSpan('`')];

		items.forEach((item) => this.appendChild(item));
		/*
		const inner = YafElement.needsParenthesis()
			? `<span class="symbol>(</span>"${this.props.value}"<span class="symbol>)</span>`
			: `"${this.props.value}"`;

		const newElement = YafElement.makeElement(
			`<span class="type">${inner}</span>`
		);
		this.parentElement?.replaceChild(newElement, this);
		*/
	}
}

const componentName: componentName = 'yaf-signature-template-literal';
customElements.define(componentName, YafSignatureTemplateLiteral);
