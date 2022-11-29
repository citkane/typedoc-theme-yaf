import { componentName } from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafSignatureTemplateLiteral extends YafElement {
	constructor() {
		super(componentName);
	}
	props!: JSONOutput.TemplateLiteralType;
	connectedCallback() {
		if (this.debounce()) return;
		const { head, tail } = this.props;

		let items = [this.makeSymbolSpan('`')];
		head && items.push(this.makeLiteralSpan(head));
		tail.forEach((item) => {
			items.push(this.makeSymbolSpan('${'));

			const type = this.renderSignatureType(
				item[0],
				'templateLiteralElement'
			);
			type.classList.add('type');
			items.push(type);
			items.push(this.makeSymbolSpan('}'));
			if (item[1]) {
				const span = this.makeLiteralSpan('');
				span.innerText = item[1];
				items.push(span);
			}
		});

		items = [...items, this.makeSymbolSpan('`')];

		items.forEach((item) => this.appendChild(item));
		/*
		const inner = this.needsParenthesis()
			? `<span class="symbol>(</span>"${this.props.value}"<span class="symbol>)</span>`
			: `"${this.props.value}"`;

		const newElement = this.makeElement(
			`<span class="type">${inner}</span>`
		);
		this.parentElement?.replaceChild(newElement, this);
		*/
	}
}

const componentName: componentName = 'yaf-signature-template-literal';
customElements.define(componentName, YafSignatureTemplateLiteral);
