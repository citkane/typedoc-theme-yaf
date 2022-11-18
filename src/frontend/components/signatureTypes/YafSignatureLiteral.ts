import { componentName } from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { JSONOutput } from 'typedoc';

export class YafContentSignatureLiteral extends YafElement {
	props!: JSONOutput.LiteralType;

	constructor() {
		super(componentName);
	}
	connectedCallback() {
		if (this.debounce()) return;
		this.classList.add('type');
		if (this.needsParenthesis()) {
			this.innerHTML = `<span class="symbol>(</span>"${this.props.value}"<span class="symbol>)</span>`;
		} else {
			this.innerText = `"${this.props.value}"`;
		}
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

const componentName: componentName = 'yaf-signature-literal';
customElements.define(componentName, YafContentSignatureLiteral);
